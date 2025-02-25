import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/env";
import { JwtPayloadType } from "../lib/types/jwt.types";

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

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Access token is required" });
    return;
  }

  jwt.verify(token, JWT_SECRET as string, (err, payload: JwtPayloadType) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.userId = payload.id;
    console.log(
      `ROUTE: ${req.method} ${req.originalUrl} ---| USER: ${payload.email}`
    );
    next();
  });
};
