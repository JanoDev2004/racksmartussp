// controllers/suppliesController.js
import Supply from "../models/supplies.model.js";
import { logSupplyAction } from "./actionLogManagement.controller.js";

/* ===== GET ALL SUPPLIES ===== */
export const getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find().sort({ createdAt: -1 });
    res.json(supplies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET SINGLE SUPPLY ===== */
export const getSupplyById = async (req, res) => {
  try {
    const supply = await Supply.findById(req.params.id);
    if (!supply) return res.status(404).json({ message: "Supply not found" });
    res.json(supply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== CREATE SUPPLY ===== */
export const createSupply = async (req, res) => {
  try {
    const userId = req.user._id; // ID of the user performing the action
    const supply = new Supply(req.body);
    const savedSupply = await supply.save();

    // Log action
    await logSupplyAction({ userId, supply: savedSupply, action: "add" });

    res.status(201).json(savedSupply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ===== UPDATE SUPPLY ===== */
export const updateSupply = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedSupply = await Supply.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSupply) return res.status(404).json({ message: "Supply not found" });

    // Log action
    await logSupplyAction({ userId, supply: updatedSupply, action: "update" });

    res.json(updatedSupply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ===== DELETE SUPPLY ===== */
export const deleteSupply = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedSupply = await Supply.findByIdAndDelete(req.params.id);
    if (!deletedSupply) return res.status(404).json({ message: "Supply not found" });

    // Log action
    await logSupplyAction({ userId, supply: deletedSupply, action: "delete" });

    res.json({ message: "Supply deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== ARCHIVE SUPPLY ===== */
export const archiveSupply = async (req, res) => {
  try {
    const userId = req.user._id;
    const archivedSupply = await Supply.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );

    if (!archivedSupply) return res.status(404).json({ message: "Supply not found" });

    // Log action
    await logSupplyAction({ userId, supply: archivedSupply, action: "archive" });

    res.json(archivedSupply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
