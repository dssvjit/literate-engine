import { Request, Response } from "express";
import { db } from "../lib/config/prisma.config";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {
  createParticipantSchema,
  createSchema,
  getIfUserRegisteredSchema,
} from "../lib/schema/event.schema";

export const create = async (req: Request, res: Response) => {
  const { success, data } = createSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid event data"));
    return;
  }

  try {
    const { name, description, date, image } = data;

    await db.event.create({
      data: {
        name,
        description,
        date,
        image,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, {}, "Event created successfully"));
    return;
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json(new ApiError(400, "Error creating event"));
    return;
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await db.event.findMany({
      select: {
        id: true,
        image: true,
        date: true,
        description: true,
        name: true,
      },
    });

    res.status(200).json(new ApiResponse(200, events, "Fetched all events"));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error fetching events", error));
  }
};

export const createParticipant = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { success, data } = createParticipantSchema.safeParse(req.query);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid participant data"));
    return;
  }

  try {
    const { eventId } = data;

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      res.status(404).json(new ApiError(404, "Event not found"));
      return;
    }

    await db.eventParticipant.create({
      data: {
        eventId,
        userId,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, {}, "Participant created successfully"));
  } catch (error) {
    console.log("CREATE PARTICIPANT ERROR: ", error);
    res.status(400).json(new ApiError(400, "Error creating participant"));
  }
};

export const getIfUserRegistered = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { success, data } = getIfUserRegisteredSchema.safeParse(req.query);

  if (!success) {
    res.status(400).json(new ApiError(400, "Invalid participant data"));
    return;
  }

  try {
    const { eventId } = data;

    const event = await db.eventParticipant.findMany({
      where: {
        userId,
        eventId,
      },
    });

    if (event.length === 0) {
      res
        .status(203)
        .json(
          new ApiResponse(203, { isParticipant: false }, "User not participant")
        );
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isParticipant: true },
          "User is participant in event"
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(new ApiError(400, "Error fetching registered events", error));
  }
};
