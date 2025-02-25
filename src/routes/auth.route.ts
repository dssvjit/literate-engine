import { Router } from "express";
import {
  loginWithGithub,
  loginWithGoogle,
  refreshAccessToken,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/google", loginWithGoogle);
authRouter.get("/refresh", refreshAccessToken);
authRouter.get("/github", loginWithGithub);

export default authRouter;
