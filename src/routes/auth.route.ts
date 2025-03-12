import { Router } from "express";
import {
  adminLogin,
  loginWithGithub,
  loginWithGoogle,
  logout,
  refreshAccessToken,
  sendOtpMail,
  verifyOtp,
} from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.get("/google", loginWithGoogle);
authRouter.get("/refresh", authenticateJWT, refreshAccessToken);
authRouter.get("/github", loginWithGithub);
authRouter.get("/email/otp", sendOtpMail);
authRouter.post("/email/otp/verify", verifyOtp);
authRouter.put("/logout", authenticateJWT, logout);
authRouter.post("/admin", adminLogin);

export default authRouter;
