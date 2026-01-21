// models/ActionLog.model.js
import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemType: { type: String, enum: ["Product", "Supply", "Asset"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ["add", "update", "delete",], required: true },
    description: { type: String }, // optional notes
  },
  { timestamps: true }
);

const ActionLog = mongoose.model("ActionLog", actionLogSchema);
export default ActionLog;