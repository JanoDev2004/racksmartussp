import mongoose from "mongoose";

const inboundItemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
  },
  dimension: {
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

const inboundRecordSchema = new mongoose.Schema(
  {
    containerNumber: {
      type: String,
      unique: true,
      required: true, // e.g. PL-1234
    },

    poNumber: {
      type: String,
      required: true,
      trim: true,
    },

    supplier: {
      type: String,
      trim: true,
    },

    deliveryDate: {
      type: Date,
    },

    preparedBy: {
      type: String,
      trim: true,
    },

    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: {
      type: Date,
    },

    items: {
      type: [inboundItemSchema],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Posted"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const InboundRecord = mongoose.model(
  "InboundRecord",
  inboundRecordSchema
);

export default InboundRecord;