import Asset from "../models/assets.model.js";
import { logAssetAction } from "./actionLogManagement.controller.js"; // Make sure you have a function to log actions

// Get all assets
export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single asset by ID
export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new asset
export const createAsset = async (req, res) => {
  try {
    const userId = req.user._id; // ID of the user performing the action
    const newAsset = new Asset(req.body);
    const savedAsset = await newAsset.save();

    // Log action
    await logAssetAction({ userId, asset: savedAsset, action: "add" });

    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update asset by ID
export const updateAsset = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) return res.status(404).json({ message: "Asset not found" });

    // Log action
    await logAssetAction({ userId, asset: updatedAsset, action: "update" });

    res.status(200).json(updatedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete asset by ID
export const deleteAsset = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);

    if (!deletedAsset) return res.status(404).json({ message: "Asset not found" });

    // Log action
    await logAssetAction({ userId, asset: deletedAsset, action: "delete" });

    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive asset
export const archiveAsset = async (req, res) => {
  try {
    const userId = req.user._id;
    const archivedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );

    if (!archivedAsset) return res.status(404).json({ message: "Asset not found" });

    // Log action
    await logAssetAction({ userId, asset: archivedAsset, action: "archive" });

    res.status(200).json(archivedAsset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
