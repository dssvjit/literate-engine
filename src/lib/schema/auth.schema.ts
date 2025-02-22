import z from "../config/zod.config";

export const loginWithGoogleSchema = z.object({
  code: z.string().nonempty(),
});

export const refreshAccessTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
});
