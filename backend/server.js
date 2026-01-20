import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "./routes/auth.route.js"
import userLogsRoute from "./routes/userLogs.route.js"
import usersRoutes from "./routes/users.route.js"

import productRoutes from "./routes/products.route.js"
import suppliestRoutes from "./routes/supplies.route.js"
import assetsRoutes from "./routes/assets.route.js"
import inboundRoutes from "./routes/inboundRecord.route.js"
import outboundRoutes from "./routes/outboundRecord.route.js"
import borrowerRoutes from "./routes/borrowerRecord.route.js"
import reserveStockRoutes from "./routes/reserveStock.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"
import reportsRoutes from "./routes/reports.route.js"
import announcementRoutes from "./routes/announcement.route.js"

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

app.use("/api/products", productRoutes);
app.use("/api/supplies", suppliestRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/inbound", inboundRoutes);
app.use("/api/outbound", outboundRoutes);
app.use("/api/borrow", borrowerRoutes);
app.use("/api/reserve", reserveStockRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/announcements", announcementRoutes);


app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});