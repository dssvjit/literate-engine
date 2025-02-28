import z from "../config/zod.config";

export const loginWithOAuthSchema = z.object({
  code: z.string().nonempty(),
});

export const sendOtpMailSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(4),
  token: z.string().nonempty(),
});

export const decodeOtpSchema = z.object({
  otp: z.string().length(4),
  email: z.string().email(),
  exp: z.number(),
  iat: z.number(),
});

export const refreshAccessTokenSchema = z.object({
  accessToken: z.string().nonempty(),
});

export const logoutSchema = z.object({
  accessToken: z.string().nonempty(),
});
