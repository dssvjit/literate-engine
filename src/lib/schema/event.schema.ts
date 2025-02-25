import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(5, "Event name is required"),
  description: z.string().min(10, "Description is required"),
  venue: z.string().min(5, "Venue is required"),
  date: z.string().date("Invalid date format"),
  mode: z.enum(["ONLINE", "OFFLINE"]),
  userId: z.string(),
});

export const eventIdSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
});
