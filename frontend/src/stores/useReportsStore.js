import { create } from "zustand";
import axios from "../lib/axios";

const useReportsStore = create((set, get) => ({
  // ================= STATE =================
  reports: {
    inventory: [],
    actionManagement: [],          // will fetch action logs
    stockTransactionTracker: [],
    personnelActivity: [],
  },

  filters: {
    inventory: "",
    category: "",
    stakeholder: "",
    transactionType: "",
    product: "",
    user: "",
    action: "",
    startDate: "",
    endDate: "",
  },

  categories: [],

  loading: false,
  error: null,

  // ================= FILTER HANDLERS =================
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        inventory: "",
        category: "",
        stakeholder: "",
        transactionType: "",
        product: "",
        user: "",
        action: "",
        startDate: "",
        endDate: "",
      },
    }),

  // ================= INVENTORY OVERVIEW =================
  fetchInventoryReport: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`/reports/inventory-overview`, {
        params: {
          inventory: filters.inventory,
          category: filters.category,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });

      set((state) => ({
        reports: { ...state.reports, inventory: res.data },
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to load inventory report",
      });
    }
  },

  // ================= INVENTORY CATEGORIES =================
  fetchInventoryCategories: async (inventoryType) => {
    if (!inventoryType || inventoryType === "products") {
      set({ categories: [] });
      return;
    }

    try {
      const res = await axios.get(`/reports/inventory-categories`, {
        params: { inventory: inventoryType },
      });
      set({ categories: res.data });
    } catch (err) {
      console.error("Category fetch error:", err);
      set({ categories: [] });
    }
  },

  // ================= ACTION MANAGEMENT =================
  fetchActionManagementReport: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`/reports/action-logs`, {
        params: {
          itemType: filters.inventory || "",  // Optional filter for Product/Supply/Asset
          user: filters.user || "",
          action: filters.action || "",
          startDate: filters.startDate || "",
          endDate: filters.endDate || "",
        },
      });

      set((state) => ({
        reports: { ...state.reports, actionManagement: res.data },
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to load action logs",
      });
    }
  },

  // ================= STOCK TRANSACTION TRACKER =================
fetchStockTransactionTracker: async () => {
  const { filters } = get();
  set({ loading: true, error: null });

  try {
    const res = await axios.get(`/reports/stock-transactions-tracker`, {
      params: {
        stakeholder: filters.stakeholder || "",
        product: filters.product || "",
        transactionType: filters.transactionType || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      },
    });

    set((state) => ({
      reports: {
        ...state.reports,
        stockTransactionTracker: res.data,
      },
      loading: false,
    }));
  } catch (err) {
    set({
      loading: false,
      error:
        err.response?.data?.message ||
        "Failed to load stock transaction tracker",
    });
  }
},

}));

export default useReportsStore;
