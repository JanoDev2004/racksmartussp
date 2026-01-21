// routes/supplies.js
import express from "express";
import {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
  archiveSupply,
} from "../controllers/supplies.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET all supplies
router.get("/", getAllSupplies);

// GET a single supply by ID
router.get("/:id", getSupplyById);

// CREATE a new supply
router.post("/", protectRoute, createSupply);

// UPDATE a supply by ID
router.put("/:id", protectRoute, updateSupply);

// DELETE a supply by ID
router.delete("/:id", protectRoute, deleteSupply);

// ARCHIVE a supply by ID
router.patch("/:id/archive", protectRoute, archiveSupply);

export default router;
