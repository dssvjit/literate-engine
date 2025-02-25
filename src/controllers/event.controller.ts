import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { eventIdSchema } from "../lib/schema/event.schema";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, venue, date, mode, userId } = req.body;

    const event = await db.event.create({
      data: {
        name,
        description,
        venue,
        date: new Date(date),
        mode,
        userId,
      },
      include: {
        createdBy: true,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error creating event"));
  }
};

// Get All Events
export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await db.event.findMany({ include: { createdBy: true } });

    res.status(200).json(new ApiResponse(200, events, "Fetched all events"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching events", error));
  }
};

// Get Event By ID
export const getEventById = async (req: Request, res: Response) => {
  const { success, data } = eventIdSchema.safeParse(req.params);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid event ID"));
    return;
  }

  try {
    const event = await db.event.findUnique({
      where: { id: data.id },
      include: { createdBy: true },
    });

    if (!event) {
      res.status(404).json(new ApiError(404, "Event not found"));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, event, "Event fetched successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching event", error));
  }
};
//update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, venue, date, mode, userId } = req.body;

    const updatedEvent = await db.event.update({
      where: { id },
      data: { name, description, venue, date: new Date(date), mode, userId },
      include: {
        createdBy: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error updating event"));
  }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
  const { success, data } = eventIdSchema.safeParse(req.params);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid event ID"));
    return;
  }

  try {
    await db.event.delete({ where: { id: data.id } });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Event deleted successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error deleting event", error));
  }
};
