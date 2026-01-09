import express from "express";
import { confirmInboundRecord, createInboundRecord, getInboundRecords, getPendingPackingLists } from "../controllers/inboundRecord.controller.js";


const router = express.Router();

router.post("/", createInboundRecord);
router.get("/", getInboundRecords);
router.get("/pending", getPendingPackingLists);
router.post("/confirm", confirmInboundRecord);

export default router;
