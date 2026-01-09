import { create } from "zustand";
import axios from "../lib/axios";

export const useOutboundStore = create((set, get) => ({
  // ================= STATE =================
  outboundRecords: [],
  products: [],
  loading: false,
  error: null,

  // ================= FETCH ALL OUTBOUND RECORDS =================
  fetchOutboundRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/outbound");
      set({ outboundRecords: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // ================= FETCH PRODUCTS FOR DROPDOWN =================
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/products"); // Correct endpoint
      set({ products: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // ================= CREATE NEW OUTBOUND RECORD =================
  addOutboundRecord: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/outbound", data);
      set((state) => ({
        outboundRecords: [res.data.outbound, ...state.outboundRecords],
        loading: false,
      }));
      return { success: true, outbound: res.data.outbound };
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  // ================= CONFIRM OUTBOUND RECORD =================
  confirmOutboundRecord: async (packingNumber, items) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/outbound/confirm", { packingNumber, items });

      // Update the specific record in the store
      set((state) => ({
        outboundRecords: state.outboundRecords.map((record) =>
          record.packingNumber === packingNumber
            ? res.data.outbound
            : record
        ),
        loading: false,
      }));

      return { success: true, outbound: res.data.outbound };
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },
}));
