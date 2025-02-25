import { z } from "zod";

//blog schemas
export const blogSchema = z.object({
  title: z.string().min(3, "Title must be atleast 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  readme: z.string().min(10, "Readme must be at least 15 characters long"),
  userId: z.string(),
});

export const blogIdSchema = z.object({
  id: z.string(),
});
