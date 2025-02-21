import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_: Request, res: Response) => {
  res.send("Yes its working! 🥳");
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
