import express from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../controllers/assets.controller.js";

const router = express.Router();

// CRUD routes
router.get("/", getAssets);           // Get all assets
router.get("/:id", getAssetById);    // Get single asset
router.post("/", createAsset);       // Create new asset
router.put("/:id", updateAsset);     // Update asset
router.delete("/:id", deleteAsset);  // Delete asset

export default router;