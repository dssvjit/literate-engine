import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/env";
import { ApiResponse } from "../utils/ApiResponse";
import { db } from "../lib/config/prisma.config";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "30d",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res
        .status(403)
        .json(new ApiResponse(403, null, "Access token is required"));
      return;
    }

    jwt.verify(token, JWT_SECRET as string, async (err, payload: any) => {
      if (err) {
        res
          .status(403)
          .json(new ApiResponse(403, null, "Invalid access token"));
        return;
      }

      const user = await db.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.refreshToken) {
        res
          .status(401)
          .json(
            new ApiResponse(401, null, "Unauthorized: No refresh token found")
          );
        return;
      }

      const decodedRefreshToken = jwt.decode(
        user.refreshToken
      ) as jwt.JwtPayload;

      if (
        !decodedRefreshToken ||
        decodedRefreshToken.exp! < Date.now() / 1000
      ) {
        res
          .status(401)
          .json(
            new ApiResponse(
              401,
              null,
              "Refresh token expired. Please log in again."
            )
          );

        return;
      }

      req.userId = payload.id;
      console.log(
        `ROUTE: ${req.method} ${req.originalUrl} ---| USER: ${user.email}`
      );

      next();
    });
  } catch (error) {
    console.error("JWT AUTH ERROR: ", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};
