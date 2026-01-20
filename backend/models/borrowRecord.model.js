import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    borrower: {
      type: String,
      required: true,
      trim: true,
    },
    remarks: {
      type: String, // ✅ optional remarks
      trim: true,
      default: "", // optional: default empty string
    },
    items: [
      {
        supplyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supply",
          required: true,
        },
        itemCode: {
          type: String,
          required: true,
        },
        itemDescription: String,
        qty: { type: Number, required: true, min: 1 },
        uom: String,
      },
    ],
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED"],
      default: "BORROWED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BorrowRecord", borrowRecordSchema);