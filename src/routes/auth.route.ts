import { Router } from "express";
import {
  loginWithGoogle,
  refreshAccessToken,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/google", loginWithGoogle);
authRouter.get("/refresh", refreshAccessToken);

export default authRouter;
