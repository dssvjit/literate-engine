import { Router } from "express";
import {
  create,
  createParticipant,
  getAllEvents,
  getIfUserRegistered,
} from "../controllers/event.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const eventRouter: Router = Router();

eventRouter.post("", create);
eventRouter.get("", getAllEvents);
eventRouter.post("/register", authenticateJWT, createParticipant);
eventRouter.get("/register", authenticateJWT, getIfUserRegistered);

export default eventRouter;
