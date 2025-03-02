import { Request, Response } from "express";
import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse";
import {
  sendOtpMailSchema,
  loginWithOAuthSchema,
  refreshAccessTokenSchema,
  verifyOtpSchema,
  decodeOtpSchema,
  logoutSchema,
} from "../lib/schema/auth.schema";
import { db } from "../lib/config/prisma.config";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/env";
import { generateOTP } from "../utils/otp";
import { transporter } from "../utils/email";
import { getEmailContent } from "../utils/emailTemplate";
import { profileLists } from "../lib/lists/profile.lists";
import { nameLists } from "../lib/lists/name.lists";

export const loginWithGoogle = async (req: Request, res: Response) => {
  const {
    success,
    data: { code },
  } = loginWithOAuthSchema.safeParse(req.query);

  if (!success) {
    res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid query parameters provided"));
    return;
  }

  if (!code) {
    res.status(400).json(new ApiResponse(400, null, "Invalid code"));
    return;
  }

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL,
        grant_type: "authorization_code",
      }
    );

    const accessToken = tokenResponse.data.access_token as string;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!userResponse.data) {
      res.status(400).json(new ApiResponse(400, null, "Invalid user data"));
      return;
    }

    const { name, email, picture } = userResponse.data;

    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      const refreshToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "30d",
      });

      user = await db.user.create({
        data: {
          email,
          name,
          imageUrl: picture,
          role: "User",
          refreshToken: refreshToken,
        },
      });
    }

    const payload = {
      id: user.id,
      email,
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: "Bearer " + newAccessToken,
        },
        "Successfully logged in with Google"
      )
    );
  } catch (error) {
    console.log("LOGIN WITH GOOGLE ERROR: ", error);
    res.status(500).json(new ApiResponse(500, null, "An error occurred"));
  }
};

export const loginWithGithub = async (req: Request, res: Response) => {
  const {
    success,
    data: { code },
  } = loginWithOAuthSchema.safeParse(req.query);

  console.log("GITHUB LOGIN CODE: ", code);

  if (!success) {
    res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid query parameters provided"));

    return;
  }

  if (!code) {
    res.status(400).json(new ApiResponse(400, null, "Invalid code"));
    return;
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    console.log("TOKEN RESPONSE: ", tokenResponse.data.access_token);

    const accessToken = tokenResponse.data.access_token as string;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.data) {
      res.status(400).json(new ApiResponse(400, null, "Invalid user data"));
      return;
    }

    const { name, email, avatar_url } = userResponse.data;

    let user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      const refreshToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "30d",
      });

      user = await db.user.create({
        data: {
          email,
          name,
          imageUrl: avatar_url,
          role: "User",
          refreshToken: refreshToken,
        },
      });
    }

    const payload = {
      id: user.id,
      email,
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: "Bearer " + newAccessToken,
        },
        "Successfully logged in with Google"
      )
    );
  } catch (error) {
    console.log("LOGIN WITH GITHUB ERROR: ", error);
    res.status(500).json(new ApiResponse(500, null, "An error occurred"));
  }
};

export const sendOtpMail = async (req: Request, res: Response) => {
  const { success, data } = sendOtpMailSchema.safeParse(req.query);

  if (!success) {
    res.status(400).json(new ApiResponse(400, null, "Invalid request body"));

    return;
  }

  try {
    const { email } = data;

    const otp = await generateOTP();

    const expiresAt = Math.floor(Date.now() / 1000) + 60;

    const token = jwt.sign({ email, otp, exp: expiresAt }, JWT_SECRET);

    const mailContent = getEmailContent(otp);

    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL_USER,
      to: email,
      subject: "OTP for login",
      html: mailContent,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          expiresAt,
          email,
        },
        "OTP sent to email"
      )
    );
  } catch (error) {
    console.log("LOGIN WITH EMAIL ERROR: ", error);
    res.status(500).json(new ApiResponse(500, null, "An error occurred"));
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { success, data } = verifyOtpSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json(new ApiResponse(400, null, "Invalid request body"));
    return;
  }

  const { email, otp, token } = data;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      otp: string;
      exp: number;
    };

    console.log("VERIFY DECODED: ", decoded);

    const { success, data: decodedData } = decodeOtpSchema.safeParse(decoded);

    if (!success) {
      res.status(400).json(new ApiResponse(400, null, "Invalid token"));
      return;
    }

    console.log("VALID DECODED");

    if (otp !== decodedData.otp) {
      res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
      return;
    }

    console.log("OTP MATCHED");

    if (email !== decodedData.email) {
      res.status(400).json(new ApiResponse(400, null, "Invalid email"));
      return;
    }

    console.log("EMAIL MATCHED");

    if (decodedData.exp < Math.floor(Date.now() / 1000)) {
      res.status(403).json(new ApiResponse(400, null, "OTP expired"));
      return;
    }

    console.log("OTP NOT EXPIRED");

    let user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      const refreshToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "30d",
      });

      const randomProfile = Math.floor(Math.random() * profileLists.length);
      const randomName = Math.floor(Math.random() * nameLists.length);

      user = await db.user.create({
        data: {
          email,
          name: nameLists[randomName],
          imageUrl: profileLists[randomProfile],
          role: "User",
          refreshToken: refreshToken,
        },
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: "Bearer " + accessToken,
        },
        "Successfully logged in"
      )
    );
  } catch (error) {
    console.error("VERIFY OTP ERROR: ", error);
    res.status(403).json(new ApiResponse(403, null, "Invalid OTP"));
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { success, data } = refreshAccessTokenSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json(new ApiResponse(400, null, "Invalid request body"));

    return;
  }

  try {
    const decoded = jwt.verify(data.accessToken, JWT_SECRET) as {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      res.status(403).json(new ApiResponse(403, null, "Access token expired"));
      return;
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json(new ApiResponse(401, null, "User not found"));
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "New access token issued"));
  } catch (error) {
    console.error("REFRESH TOKEN ERROR: ", error);
    res.status(403).json(new ApiResponse(403, null, "Invalid refresh token"));
  }
};

export const logout = async (req: Request, res: Response) => {
  const { success, data } = logoutSchema.safeParse(req.body);
  const userId = req.userId;

  if (!success) {
    res.status(400).json(new ApiResponse(400, null, "Invalid request body"));
    return;
  }

  try {
    const { accessToken } = data;

    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      email: string;
      id: string;
      iat: number;
      exp: number;
    };

    console.log("DOCODED ID: ", decoded.id);
    console.log("USER ID: ", userId);

    if (decoded.id !== userId) {
      res.status(403).json(new ApiResponse(403, null, "Invalid user"));
      return;
    }

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      res.status(403).json(new ApiResponse(403, null, "Refresh token expired"));
      return;
    }

    await db.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        refreshToken: "",
      },
    });

    res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
  } catch (error) {
    console.error("LOGOUT ERROR: ", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "An error occurred  while logging out"));
  }
};
