import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true },
  role: { type: String, required: true },
  event: { type: String, required: true }, // frontend expects `event`
  additional: { type: String }, // optional extra info like IP
  dateTime: { type: Date, default: Date.now }, // single timestamp for both login/logout
});

const UserLog = mongoose.model("UserLog", userLogSchema);
export default UserLog;
