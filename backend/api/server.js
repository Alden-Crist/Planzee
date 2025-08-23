import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectDB } from "../config/db.js";
import userRouter from "../routes/userRoute.js";
import taskRouter from "../routes/taskRoute.js";

const app = express();

const port = process.env.PORT || 4000;

//MIDDLEWARE
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB CONNECT
connectDB();

//Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Backend is Running");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
