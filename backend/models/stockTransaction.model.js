import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["INBOUND", "OUTBOUND"],
      required: true,
    },

    referenceNo: {
      type: String, // containerNumber or packingNumber
      required: true,
    },

    stakeholder: {
      type: String, // supplier / customer / consignee
    },

    productCode: String,
    productDescription: String,
    qty: Number,
    uom: String,

    action: {
      type: String,
      enum: ["CREATED", "CONFIRMED"],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    performedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StockTransaction", stockTransactionSchema);
