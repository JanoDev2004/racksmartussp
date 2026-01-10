import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // e.g., Electronics, Furniture
    itemDescription: { type: String, required: true }, // e.g., Laptop, Office Chair
    segment: { type: String, required: true }, // e.g., IT, HR, Admin
    brand: { type: String, required: true }, // e.g., Dell, Ikea
    quantity: { type: Number, required: true, min: 1 }, // Number of items
    serialNo: { type: String, unique: true }, // Serial number of the asset
    acquisitionDate: { type: Date, required: true }, // Date acquired
    archived: { type: Boolean, default: false }, // For archiving assets
  },
  { timestamps: true }
);

export default mongoose.model("Asset", assetSchema);
