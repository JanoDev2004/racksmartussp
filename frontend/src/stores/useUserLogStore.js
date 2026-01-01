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
      const res = await axios.get("/user-logs"); // 👈 adjust if your route differs
      set({ logs: res.data.logs || [], loading: false });
    } catch (error) {
      console.error("Error fetching user logs:", error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch user logs");
    }
  },

  /** ================================
   * 🔍 FILTER OR SEARCH LOGS LOCALLY
   * (optional helper — purely frontend)
   * ================================ */
  filterLogs: (query) => {
    set((state) => ({
      logs: state.logs.filter(
        (log) =>
          log.userName?.toLowerCase().includes(query.toLowerCase()) ||
          log.role?.toLowerCase().includes(query.toLowerCase()) ||
          log.activity?.toLowerCase().includes(query.toLowerCase())
      ),
    }));
  },

  /** ================================
   * 🧹 CLEAR LOGS FROM STATE
   * ================================ */
  clearLogs: () => set({ logs: [] }),
})); 