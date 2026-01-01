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
    const { userId, userName, role, event, additional } = req.body;

    const newLog = await UserLog.create({
      userId,
      userName,
      role,
      event,        // e.g., "User logged in" / "User logged out"
      additional,   // e.g., "IP: 127.0.0.1"
      dateTime: new Date(),
    });

    res.status(201).json({ message: "Log created", log: newLog });
  } catch (error) {
    res.status(500).json({ message: "Error creating log", error });
  }
};