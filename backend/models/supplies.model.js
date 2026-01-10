// models/Supply.model.js
import mongoose from "mongoose";

const supplySchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    itemCode: { type: String, required: true, unique: true, trim: true },
    itemDescription: { type: String, trim: true },
    segment: { type: String, trim: true },
    dimension: { type: String, trim: true },
    quantity: { type: Number, default: 0, min: 0 },
    color: { type: String, trim: true },
    brand: { type: String, trim: true },
    serialNo: { type: String, trim: true },
    acquisitionDate: { type: Date },
    location: { type: String, trim: true },
    accountTo: { type: String, trim: true },
    uom: { type: String, trim: true }, // Unit of Measure
    archived: { type: Boolean, default: false }, // for archiving supplies
  },
  { timestamps: true }
);

const Supply = mongoose.model("Supply", supplySchema);

export default Supply;
