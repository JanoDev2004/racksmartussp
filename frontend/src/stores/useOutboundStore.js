import { create } from "zustand";
import axios from "../lib/axios";

export const useOutboundStore = create((set, get) => ({
  // ================= STATE =================
  outboundRecords: [],
  pendingOutboundPackingLists: [],
  loading: false,
  error: null,

  // ================= FETCH ALL OUTBOUND =================
  fetchOutboundRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/outbound");
      set({ outboundRecords: res.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load outbound records",
        loading: false,
      });
    }
  },

  // ================= FETCH PENDING PACKING LISTS =================
  fetchPendingOutboundPackingLists: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/outbound/pending");
      set({ pendingOutboundPackingLists: res.data || [], loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to load pending outbound packing lists",
        loading: false,
      });
    }
  },

  // ================= CREATE OUTBOUND RECORD =================
  createOutboundRecord: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/outbound", payload);

      // ✅ Same pattern as inbound
      set((state) => ({
        outboundRecords: [res.data.outbound, ...state.outboundRecords],
        pendingOutboundPackingLists: [
          res.data.outbound,
          ...state.pendingOutboundPackingLists,
        ],
        loading: false,
      }));

      return { success: true, data: res.data.outbound };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create outbound record";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ================= CONFIRM OUTBOUND =================
  confirmOutbound: async ({ packingNumber, items }) => {
    set({ loading: true, error: null });

    try {
      await axios.post("/outbound/confirm", { packingNumber, items });

      // ✅ REMOVE confirmed PL from pending list (IDENTICAL to inbound)
      set((state) => ({
        pendingOutboundPackingLists:
          state.pendingOutboundPackingLists.filter(
            (pl) => pl.packingNumber !== packingNumber
          ),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to confirm outbound";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ================= GETTERS =================
  getPackingListByPackingNumber: (packingNumber) => {
    return get().pendingOutboundPackingLists.find(
      (pl) => pl.packingNumber === packingNumber
    );
  },

  // ================= RESET =================
  clearOutboundStore: () => {
    set({
      outboundRecords: [],
      pendingOutboundPackingLists: [],
      loading: false,
      error: null,
    });
  },
}));
