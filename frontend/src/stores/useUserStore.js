import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  pendingUser: null,
  requiresVerification: false,
  loading: false,
  checkingAuth: true,

  // Send verification code
  sendVerificationCode: async (email) => {
    try {
      await axios.post("/auth/send-code", { email });
      toast.success("Verification code sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    }
  },

  // Verify code and set actual user
  verifyCode: async (email, code) => {
    try {
      const res = await axios.post("/auth/verify-code", { email, code });
      toast.success("Verification successful!");

      // Move pendingUser → user
      const finalUser = get().pendingUser;
      set({
        user: finalUser,
        pendingUser: null,
        requiresVerification: false,
      });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code");
      return false;
    }
  },

  signup: async (data) => {
    set({ loading: true });
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", data);
      set({ user: res.data, loading: false });
      toast.success("Sign up successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });

      if (res.data.requiresVerification) {
        set({
          pendingUser: res.data.user,
          requiresVerification: true,
          loading: false,
        });

        toast.success("Verification code sent! Check your email.");
        return { requiresVerification: true };
      }

      set({ user: res.data.user, loading: false });
      toast.success("Login successful!");
      return { requiresVerification: false };
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid email or password");
      return { requiresVerification: false };
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null, pendingUser: null, requiresVerification: false });
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Check if user is already logged in
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },

  // Refresh token logic
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
