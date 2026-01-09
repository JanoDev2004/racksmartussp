import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserLogStore = create((set) => ({
  logs: [],
  loading: false,

  /** ================================
   * 📜 FETCH ALL USER LOGS
   * ================================ */
  fetchUserLogs: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/user-logs");
      const logs = res.data.logs || [];

      // Normalize backend data
      const mappedLogs = logs.map((log) => ({
        _id: log._id,
        userId: log.userId,
        userName: log.userName,
        role: log.role,
        event: log.event || log.activity || "Unknown Event",
        additional: log.additional || `IP: ${log.ip || "N/A"}`,
        dateTime: log.dateTime ? new Date(log.dateTime) : new Date(),
      }));

      set({ logs: mappedLogs, loading: false });
    } catch (error) {
      console.error("Error fetching user logs:", error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch user logs");
    }
  },

  /** ================================
   * 🔍 FILTER OR SEARCH LOGS LOCALLY
   * ================================ */
  filterLogs: (query) => {
    set((state) => ({
      logs: state.logs.filter(
        (log) =>
          log.userName?.toLowerCase().includes(query.toLowerCase()) ||
          log.role?.toLowerCase().includes(query.toLowerCase()) ||
          log.event?.toLowerCase().includes(query.toLowerCase())
      ),
    }));
  },

  /** ================================
   * 🧹 CLEAR LOGS FROM STATE
   * ================================ */
  clearLogs: () => set({ logs: [] }),

  /** ================================
   * ✏️ CREATE A NEW LOG (LOGIN/LOGOUT)
   * ================================ */
  createLog: async ({ userId, userName, role, event, additional }) => {
  try {
    // Fallbacks in case values are missing
    const finalUserName = userName || "Unknown User";
    const finalRole = role || "Unknown Role";

    const res = await axios.post("/user-logs", { 
      userId, 
      userName: finalUserName, 
      role: finalRole, 
      event, 
      additional 
    });

    const newLog = res.data.log;

    set((state) => ({
      logs: [
        {
          _id: newLog?._id || Date.now().toString(),
          userId,
          userName: finalUserName,
          role: finalRole,
          event,
          additional,
          dateTime: newLog?.dateTime ? new Date(newLog.dateTime) : new Date(),
        },
        ...state.logs,
      ],
    }));

    toast.success("User activity logged!");
  } catch (error) {
    console.error("Error creating log:", error);
    toast.error(error.response?.data?.message || "Failed to log activity");
  }
},
}));
