// routes/outboundRecord.routes.js
import express from "express";
import {
  createOutboundRecord,
  getOutboundRecords,
  getPendingOutboundRecords,
  confirmOutboundRecord,
} from "../controllers/outboundRecord.controller.js";

const router = express.Router();
router.get("/", getOutboundRecords);
router.get("/pending", getPendingOutboundRecords);
router.post("/", createOutboundRecord);

router.post("/confirm", confirmOutboundRecord);


export default router;
