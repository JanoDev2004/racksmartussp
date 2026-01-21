import mongoose from "mongoose";

// ================= OUTBOUND ITEM SCHEMA =================
const outboundItemSchema = new mongoose.Schema({
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

// ================= OUTBOUND RECORD SCHEMA =================
const outboundRecordSchema = new mongoose.Schema(
  {
    packingNumber: {
      type: String,
      unique: true,
      required: true, // e.g., OUT-1234
    },
    consignee: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    dispatchDate: {
      type: Date,
    },
    referenceDocs: {
      type: String,
      trim: true,
    },
    purchaseOrderNo: {
      type: String,
      trim: true,
    },
    deliveryReceipt: {
      type: String,
      trim: true,
    },
    serviceInvoice: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    preparedBy: {
      type: String,
      trim: true,
    },

    // NEW FIELDS
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: {
      type: Date,
    },
    
    items: {
      type: [outboundItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const OutboundRecord = mongoose.model("OutboundRecord", outboundRecordSchema);

export default OutboundRecord;
