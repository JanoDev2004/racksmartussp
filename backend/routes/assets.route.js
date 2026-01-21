import express from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  archiveAsset,
} from "../controllers/assets.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// CRUD routes
router.get("/", getAssets);           // Get all assets
router.get("/:id", getAssetById);    // Get single asset
router.post("/", protectRoute, createAsset);       // Create new asset
router.put("/:id", protectRoute, updateAsset);     // Update asset
router.delete("/:id", protectRoute, deleteAsset);  // Delete asset
router.patch("/:id/archive", protectRoute, archiveAsset); // Archive asset

export default router;