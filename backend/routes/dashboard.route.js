import express from "express";
import { getPendingKPIs, getGraphData } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /api/dashboard/pending
router.get("/pending", getPendingKPIs);

// GET /api/dashboard/graph?period=week|month|year
router.get("/graph", getGraphData);

export default router;