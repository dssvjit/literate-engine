import { Request, Response } from "express";
import { googleOAuth2Client } from "../lib/config/google.config";
import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse";
import {
  loginWithGoogleSchema,
  refreshAccessTokenSchema,
} from "../lib/schema/auth.schema";
import { db } from "../lib/config/prisma.config";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/env";

export const loginWithGoogle = async (req: Request, res: Response) => {
  const {
    success,
    data: { code },
  } = loginWithGoogleSchema.safeParse(req.query);

  if (!success) {
    res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid query parameters provided"));

    return;
  }

  try {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);

    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = data;

    let user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          imageUrl: picture,
          role: "User",
          refreshToken: tokens.refresh_token,
        },
      });
    }

    const payload = {
      id: user.id,
      email,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user,
          accessToken: "Bearer " + accessToken,
        },
        "Successfully logged in with Google"
      )
    );
  } catch (error) {
    console.log("LOGIN WITH GOOGLE ERROR: ", error);
    res
      .status(500)
      .json(new ApiResponse(500, null, "An error occurred while logging in"));
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const {
    success,
    data: { refreshToken },
  } = refreshAccessTokenSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json(new ApiResponse(400, null, "Invalid request body"));

    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id: string;
      email: string;
    };

    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json(new ApiResponse(401, null, "User not found"));

      return;
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "New access token issued"));
  } catch (error) {
    console.error("REFRESH TOKEN ERROR: ", error);
    res.status(403).json(new ApiResponse(403, null, "Invalid refresh token"));
  }
};
