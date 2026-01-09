// routes/supplies.js
import express from "express";
import {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
} from "../controllers/supplies.controller.js";

const router = express.Router();

// GET all supplies
router.get("/", getAllSupplies);

// GET a single supply by ID
router.get("/:id", getSupplyById);

// CREATE a new supply
router.post("/", createSupply);

// UPDATE a supply by ID
router.put("/:id", updateSupply);

// DELETE a supply by ID
router.delete("/:id", deleteSupply);

export default router;
