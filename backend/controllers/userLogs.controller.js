import UserLog from "../models/userLog.js";

/** ============================
 * ✅ GET all user logs
 * ============================ */
export const getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ loginTime: -1 });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user logs", error });
  }
};

/** ============================
 * ✅ POST create a new user log (for login/logout)
 * ============================ */
export const createUserLog = async (req, res) => {
  try {
    const { userId, userName, role, activity, status, loginTime, logoutTime, ip } = req.body;

    const newLog = await UserLog.create({
      userId,
      userName,
      role,
      activity,
      status,
      loginTime,
      logoutTime,
      ip,
    });

    console.log("✅ New log created:", newLog._id);
    res.status(201).json({ message: "Log entry created successfully", log: newLog });
  } catch (error) {
    console.error("❌ Error creating user log:", error.message);
    res.status(500).json({ message: "Error creating user log", error });
  }
};