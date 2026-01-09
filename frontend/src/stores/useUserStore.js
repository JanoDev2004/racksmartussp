import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // ================= SIGNUP =================
  signup: async (data) => {
  set({ loading: true });

  const { password, confirmPassword } = data;
  if (password !== confirmPassword) {
    set({ loading: false });
    return toast.error("Passwords do not match");
  }

  try {
    const res = await axios.post("/auth/signup", data);
    set({ loading: false });

    // ✅ Don't set user here, user is not verified yet
    toast.success(
      res.data.message ||
        "Signup successful! Check your email to verify your account."
    );
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Signup failed");
  }
},

  // ================= LOGIN =================
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      toast.success("Login successful!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid email or password");
      return false;
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // ================= CHECK AUTH =================
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },

  // ================= REFRESH TOKEN =================
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
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
