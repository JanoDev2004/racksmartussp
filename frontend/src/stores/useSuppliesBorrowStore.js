import { create } from "zustand";
import axios from "../lib/axios";

export const useBorrowStore = create((set, get) => ({
  borrowRecords: [],
  returnedRecords: [],
  loading: false,
  error: null,

  /* ===== FETCH BORROW RECORDS ===== */
  fetchBorrowRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/borrow");
      set({ borrowRecords: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch borrow records",
        loading: false,
      });
    }
  },

  /* ===== FETCH RETURNED BORROW RECORDS ===== */
  fetchReturnedBorrowRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/borrow/returned");
      set({ returnedRecords: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch returned borrow records",
        loading: false,
      });
    }
  },

  /* ===== BORROW SUPPLIES ===== */
  borrowSupplies: async (payload) => {
    set({ loading: true, error: null });
    try {
      await axios.post("/borrow", payload);

      // Refresh borrow list after borrowing
      await get().fetchBorrowRecords();

      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to borrow supplies",
        loading: false,
      });
      return false;
    }
  },

  /* ===== RETURN SUPPLIES ===== */
  returnSupplies: async (borrowId) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`/borrow/${borrowId}/return`);

      // Refresh borrow list after return
      await get().fetchBorrowRecords();

      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to return supplies",
        loading: false,
      });
      return false;
    }
  },

  /* ===== RESET ERROR ===== */
  clearError: () => set({ error: null }),
}));
