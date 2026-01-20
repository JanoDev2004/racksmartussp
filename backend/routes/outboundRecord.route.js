import express from "express";
import {
  createOutboundRecord,
  getOutboundRecords,
  getPendingOutboundRecords,
  confirmOutboundRecord,
} from "../controllers/outboundRecord.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getOutboundRecords);
router.get("/pending", protectRoute, getPendingOutboundRecords);
router.post("/", protectRoute, createOutboundRecord);

// 🔥 REQUIRED
router.post("/confirm", protectRoute, confirmOutboundRecord);

export default router;
