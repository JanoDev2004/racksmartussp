import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  status: { type: String, enum: ["Logged In", "Logged Out"], default: "Logged In" },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
  ip: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserLog = mongoose.model("UserLog", userLogSchema);
export default UserLog;