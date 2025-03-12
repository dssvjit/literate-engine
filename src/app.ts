import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/user.route";
import blogRouter from "./routes/blog.route";
import eventRouter from "./routes/event.route";
import authRouter from "./routes/auth.route";
import { authenticateJWT } from "./middlewares/auth.middleware";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateJWT, userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/event", eventRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Yes its working! 🥳");
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
