import mongoose from "mongoose";

const reserveItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  uom: {
    type: String,
  },
});

const reserveStockSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reservedBy: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [reserveItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["RESERVED", "RELEASED"],
      default: "RESERVED",
    },
  },    
  { timestamps: true }
);

export default mongoose.model("ReserveStock", reserveStockSchema);