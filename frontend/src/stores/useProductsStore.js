import { create } from "zustand";
import axios from "../lib/axios"; // 👈 adjust path if needed
import { toast } from "react-hot-toast";

export const useProductsStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get("/products");

    // ✅ DO NOT FILTER HERE
    set({ products: res.data, loading: false });
  } catch (err) {
    const message = err.response?.data?.message || "Failed to fetch products";
    toast.error(message);
    set({ error: message, loading: false });
  }
},


  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/products", productData);
      set((state) => ({
        products: [res.data, ...state.products],
        loading: false,
      }));
      toast.success("Product added successfully!"); // ✅ success toast
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add product";
      toast.error(message); // ❌ error toast
      set({ error: message, loading: false });
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/products/${id}`, productData);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? res.data : p)),
        loading: false,
      }));
      toast.success("Product updated successfully!"); // ✅ success toast
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update product";
      toast.error(message); // ❌ error toast
      set({ error: message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully!"); // ✅ success toast
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete product";
      toast.error(message); // ❌ error toast
      set({ error: message, loading: false });
    }
  },

  getProductDropDown: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get("/products/dropdown");
    set({ products: res.data, loading: false });
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to fetch products for dropdown";
    toast.error(message);
    set({ error: message, loading: false });
  }
},


  clearError: () => set({ error: null }),
}));
