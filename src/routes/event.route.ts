import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";

const eventRouter: Router = Router();

eventRouter.post("/", createEvent);
eventRouter.get("getAllEvents/", getAllEvents);
eventRouter.get("getEvent/:id", getEventById as any);
eventRouter.put("updatEvent/:id", updateEvent);
eventRouter.delete("deleteEvent/:id", deleteEvent);

export default eventRouter;
