import { create } from "zustand";
import axios from "../lib/axios";

const useDashboardStore = create((set, get) => ({
  pendingInbound: 0,
  pendingOutbound: 0,
  reservedStock: 0,
  graphData: [],
  loading: false,
  error: null,
  selectedPeriod: "week",

  setSelectedPeriod: (period) => {
    set({ selectedPeriod: period });
    get().fetchGraphData(period); // important
  },

  fetchPendingKPIs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/dashboard/pending");
      set({
        pendingInbound: response.data.pendingInbound,
        pendingOutbound: response.data.pendingOutbound,
        reservedStock: response.data.reservedStock,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchGraphData: async (period) => {
    if (!period) period = get().selectedPeriod;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/dashboard/graph?period=${period}`);

      const mappedData = response.data.map((item) => ({
        ...item,
        period: item._id,
      }));

      set({
        graphData: mappedData,
        selectedPeriod: period,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchDashboardData: async () => {
    await Promise.all([get().fetchPendingKPIs(), get().fetchGraphData()]);
  },
}));

export default useDashboardStore;
