import { z } from "zod";
//user schemas
export const userSchema = z.object({
  name: z.string().min(5, "Name must be at least 6 characters long"),
  email: z.string().email("Invalid email format"),
  imageUrl: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});

export const userIdSchema = z.object({
  id: z.string(),
});
