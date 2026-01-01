import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUsersStore = create((set) => ({
  users: [],       // 👈 must be an array
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/users"); // replace with your API
      set({ users: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  addUser: async (userData) => {
    try {
      const res = await axios.post("/users", userData);
      set((state) => ({ users: [...state.users, res.data] }));
      toast.success("User added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  },

  updateUser: async (userId, updatedData) => {
    try {
      const res = await axios.put(`/users/${userId}`, updatedData);
      set((state) => ({
        users: state.users.map((user) => (user._id === userId ? res.data : user)),
      }));
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  },

  deleteUser: async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  },
}));