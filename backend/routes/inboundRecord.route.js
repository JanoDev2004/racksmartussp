import express from "express";
import {
  confirmInboundRecord,
  createInboundRecord,
  getInboundRecords,
  getPendingPackingLists,
} from "../controllers/inboundRecord.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createInboundRecord);
router.get("/", protectRoute, getInboundRecords);
router.get("/pending", protectRoute, getPendingPackingLists);

// 🔥 REQUIRED
router.post("/confirm", protectRoute, confirmInboundRecord);

export default router;
