import { create } from "zustand";
import axios from "../lib/axios";

export const useInboundStore = create((set, get) => ({
  // ================= STATE =================
  inboundRecords: [],
  pendingPackingLists: [],
  loading: false,
  error: null,

  // ================= FETCH ALL INBOUND =================
  fetchInboundRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/inbound");
      set({ inboundRecords: res.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load inbound records",
        loading: false,
      });
    }
  },

  // ================= FETCH PENDING PACKING LISTS =================
  fetchPendingPackingLists: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/inbound/pending");
      set({ pendingPackingLists: res.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load pending packing lists",
        loading: false,
      });
    }
  },

  // ================= CREATE INBOUND (PO ➜ PL) =================
  createInboundRecord: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/inbound", payload);

      // ✅ Add new record to state immediately
      set((state) => ({
        inboundRecords: [res.data.inbound, ...state.inboundRecords],
        pendingPackingLists: [res.data.inbound, ...state.pendingPackingLists],
        loading: false,
      }));

      return { success: true, data: res.data.inbound };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create inbound record";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ================= CONFIRM INBOUND =================
  confirmInbound: async ({ containerNumber, items }) => {
    set({ loading: true, error: null });

    try {
      await axios.post("/inbound/confirm", { containerNumber, items });

      // ✅ Remove confirmed PL from pending list
      set((state) => ({
        pendingPackingLists: state.pendingPackingLists.filter(
          (pl) => pl.containerNumber !== containerNumber
        ),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to confirm inbound";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // ================= GETTERS =================
  getPackingListByContainer: (containerNumber) => {
    return get().pendingPackingLists.find(
      (pl) => pl.containerNumber === containerNumber
    );
  },

  // ================= RESET =================
  clearInboundStore: () => {
    set({
      inboundRecords: [],
      pendingPackingLists: [],
      loading: false,
      error: null,
    });
  },
}));
