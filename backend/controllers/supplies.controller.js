// controllers/suppliesController.js
import Supply from "../models/supplies.model.js";

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
    const supply = new Supply(req.body);
    await supply.save();
    res.status(201).json(supply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ===== UPDATE SUPPLY ===== */
export const updateSupply = async (req, res) => {
  try {
    const updatedSupply = await Supply.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSupply) return res.status(404).json({ message: "Supply not found" });
    res.json(updatedSupply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ===== DELETE SUPPLY ===== */
export const deleteSupply = async (req, res) => {
  try {
    const deletedSupply = await Supply.findByIdAndDelete(req.params.id);
    if (!deletedSupply) return res.status(404).json({ message: "Supply not found" });
    res.json({ message: "Supply deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
