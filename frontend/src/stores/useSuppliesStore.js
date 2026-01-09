import { create } from "zustand";
import axios from "../lib/axios"; // <-- your Axios instance

export const useSuppliesStore = create((set, get) => ({
  supplies: [],
  loading: false,
  error: null,

  /* ================= FETCH ALL SUPPLIES ================= */
  fetchSupplies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/supplies");
      set({ supplies: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch supplies:", err);
    }
  },

  /* ================= CREATE SUPPLY ================= */
  addSupply: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/supplies", payload);
      set((state) => ({ supplies: [res.data, ...state.supplies], loading: false }));
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to add supply:", err);
      throw err;
    }
  },

  /* ================= UPDATE SUPPLY ================= */
  updateSupply: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/supplies/${id}`, payload);
      set((state) => ({
        supplies: state.supplies.map((s) => (s._id === id ? res.data : s)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to update supply:", err);
      throw err;
    }
  },

  /* ================= DELETE SUPPLY ================= */
  deleteSupply: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/supplies/${id}`);
      set((state) => ({
        supplies: state.supplies.filter((s) => s._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to delete supply:", err);
      throw err;
    }
  },
}));
