import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "./routes/auth.route.js"
import userLogsRoute from "./routes/userLogs.route.js"
import usersRoutes from "./routes/users.route.js"

import { connectDB } from "./lib/db.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: "http://localhost:5173", // your React app URL
    credentials: true, // allow cookies & authorization headers
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/user-logs", userLogsRoute);
app.use("/api/users", usersRoutes);


app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});