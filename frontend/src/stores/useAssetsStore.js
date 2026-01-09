import { create } from "zustand";
import axios from "../lib/axios";

export const useAssetsStore = create((set, get) => ({
  assets: [],
  loading: false,
  error: null,

  // Fetch all assets
  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/assets");
      set({ assets: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new asset
  addAsset: async (assetData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/assets", assetData);
      set((state) => ({ assets: [...state.assets, res.data], loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update existing asset
  updateAsset: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/assets/${id}`, updatedData);
      set((state) => ({
        assets: state.assets.map((asset) =>
          asset._id === id ? res.data : asset
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete asset
  deleteAsset: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/assets/${id}`);
      set((state) => ({
        assets: state.assets.filter((asset) => asset._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Toggle archive status
  toggleArchive: async (id) => {
    set({ loading: true, error: null });
    try {
      const asset = get().assets.find(a => a._id === id);
      if (!asset) throw new Error("Asset not found");

      const res = await axios.put(`/assets/${id}`, {
        ...asset,
        archived: !asset.archived
      });

      set((state) => ({
        assets: state.assets.map((asset) =>
          asset._id === id ? res.data : asset
        ),
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Adjust quantity
  adjustQuantity: async (id, amount, mode) => {
    set({ loading: true, error: null });
    try {
      const asset = get().assets.find(a => a._id === id);
      if (!asset) throw new Error("Asset not found");

      let newQuantity = asset.quantity;
      if (mode === "add") {
        newQuantity += amount;
      } else if (mode === "damage") {
        if (amount > newQuantity) throw new Error("Cannot remove more than current quantity");
        newQuantity -= amount;
      }

      const res = await axios.put(`/assets/${id}`, {
        ...asset,
        quantity: newQuantity
      });

      set((state) => ({
        assets: state.assets.map((asset) =>
          asset._id === id ? res.data : asset
        ),
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
