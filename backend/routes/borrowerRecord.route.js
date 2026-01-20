import express from "express";
import { borrowSupplies, returnSupplies, getBorrowRecords, getReturnedBorrowRecords } from "../controllers/borrowerRecord.controller.js";

const router = express.Router();

router.post("/", borrowSupplies);
router.post("/:id/return", returnSupplies);
router.get("/", getBorrowRecords);
router.get("/returned", getReturnedBorrowRecords);

export default router;
