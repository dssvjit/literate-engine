import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

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
        createdBy: true, //this is the author relation that we created in the schema
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error creating event"));
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await db.event.findMany({
      include: {
        createdBy: true,
      },
    });

    res.status(200).json(new ApiResponse(200, events, "Fetched all events"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching events"));
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await db.event.findUnique({
      where: { id },
      include: {
        createdBy: true,
      },
    });

    if (!event)
      return res.status(404).json(new ApiError(404, "Event not found"));

    res
      .status(200)
      .json(new ApiResponse(200, event, "Event fetched successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching event"));
  }
};

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

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.event.delete({ where: { id } });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Event deleted successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error deleting event"));
  }
};
