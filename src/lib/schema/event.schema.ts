import e from "express";
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

export const createSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  image: z.string(),
});

export const createParticipantSchema = z.object({
  eventId: z.string(),
});

export const getIfUserRegisteredSchema = z.object({
  eventId: z.string(),
});
