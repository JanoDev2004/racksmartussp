import { create } from "zustand";
import axios from "../lib/axios";

const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  loading: false,
  error: null,

  /* ================= FETCH ================= */
  fetchAnnouncements: async (isAdmin = false) => {
  set({ loading: true, error: null });
  try {
    const url = isAdmin ? "/announcements/all" : "/announcements";
    const res = await axios.get(url);
    set({ announcements: res.data });
  } catch (err) {
    console.error(err);
    set({ error: "Failed to load announcements" });
  } finally {
    set({ loading: false });
  }
},

  /* ================= CREATE ================= */
  createAnnouncement: async (data) => {
    const res = await axios.post("/announcements", data);
    set((state) => ({
      announcements: [res.data, ...state.announcements],
    }));
  },

  /* ================= DISPLAY ================= */
  displayAnnouncement: async (id) => {
    const res = await axios.put(`/announcements/${id}/display`);
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a._id === id ? res.data : a
      ),
    }));
  },

  /* ================= DELETE ================= */
  deleteAnnouncement: async (id) => {
    await axios.delete(`/announcements/${id}`);
    set((state) => ({
      announcements: state.announcements.filter((a) => a._id !== id),
    }));
  },

  /* ================= SELECTORS ================= */

  // 🔔 Announcements shown on dashboard (by role)  
  getDisplayedForRole: (role) =>
    get().announcements.filter((ann) => {
      const now = new Date();
      const notExpired = !ann.expiresAt || new Date(ann.expiresAt) > now;
      return ann.isActive && ann.isDisplayed && ann.targetRoles.includes(role) && notExpired;
    }),

  // 🔔 All announcements for admin (including expired or pending)
  getAllAnnouncements: () => get().announcements,
}));

export default useAnnouncementStore;
