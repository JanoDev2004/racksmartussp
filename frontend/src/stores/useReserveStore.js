import { create } from "zustand";
import axios from "../lib/axios";

export const useReserveStore = create((set, get) => ({
  reservedPackages: [],
  releasedPackages: [],
  products: [],
  loading: false,
  error: null,

  /* ===== FETCH PRODUCTS ===== */
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/products");
      set({ products: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  /* ===== FETCH RESERVED PACKAGES ===== */
  fetchReservedPackages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/reserve");
      set({ reservedPackages: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch reserved packages",
        loading: false,
      });
    }
  },

  /* ===== FETCH RELEASED PACKAGES ===== */
  fetchReleasedPackages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/reserve/released");
      set({ releasedPackages: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch released packages",
        loading: false,
      });
    }
  },

  /* ===== RESERVE STOCK ===== */
  reserveStock: async (payload) => {
    set({ loading: true, error: null });
    try {
      await axios.post("/reserve", payload);

      // Refresh products and reserved packages
      await get().fetchProducts();
      await get().fetchReservedPackages();

      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to reserve stock",
        loading: false,
      });
      return false;
    }
  },

  /* ===== RELEASE RESERVED STOCK ===== */
  releaseReserveStock: async (reserveId) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`/reserve/${reserveId}/release`);

      // Refresh products, reserved packages, and released packages
      await get().fetchProducts();
      await get().fetchReservedPackages();
      await get().fetchReleasedPackages();

      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to release reserved stock",
        loading: false,
      });
      return false;
    }
  },

  /* ===== RESET ERROR ===== */
  clearError: () => set({ error: null }),
}));