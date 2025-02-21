import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routers/user.Router";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors({ origin: "*" })); // Allow all origins (for development)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", userRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Yes its working! 🥳");
});

// app.use(/users, userRouter);
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
