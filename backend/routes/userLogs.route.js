import express from "express";
import { createUserLog, getUserLogs } from "../controllers/userLogs.controller.js";
const router = express.Router();

router.get("/", getUserLogs);
router.post("/", createUserLog);

export default router;