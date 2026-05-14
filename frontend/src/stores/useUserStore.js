import { create } from "zustand";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import axios from "axios";

// Flag to prevent multiple simultaneous checkAuth calls
let isCheckingAuth = false;
let isRefreshing = false;

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  error: false,
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),

  signup: async ({
    name,
    email,
    password,
    confirmPassword,
    username,
    userRole,
  }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        username,
        userRole,
      });
      set({ user: res.data, loading: false });
      toast.success("Account created successfully!");
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", { email, password });

      set({ user: res.data, loading: false });
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null, checkingAuth: false });
      localStorage.removeItem("user");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    // Prevent multiple simultaneous checkAuth calls
    if (isCheckingAuth) {
      return;
    }

    isCheckingAuth = true;
    set({ checkingAuth: true });

    try {
      const response = await api.get("/auth/profile");
      console.log("checkAuth successful");
      set({ user: response.data, checkingAuth: false });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      const cached = localStorage.getItem("user");
      if (cached) {
        set({ user: JSON.parse(cached), checkingAuth: false });
      } else {
        set({ user: null, checkingAuth: false });
        localStorage.removeItem("user");
      }
    } finally {
      isCheckingAuth = false;
    }
  },

  verifyEmail: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        loading: false,
        isAuthenticated: true,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        loading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Email didn't exist",
        loading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error reset password",
        loading: false,
      });
      throw error;
    }
  },

  /*refreshToken: async () => {
    try {
      console.log("🔄 Calling refresh-token endpoint...");
      const response = await axios.post(
        "${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token",
        {},
        { withCredentials: true },
      );
      console.log("Token refresh successful");
      return response.data;
    } catch (error) {
      console.error(
        "Token refresh failed:",
        error.response?.status,
        error.response?.data?.message,
      );
      // Clear user and redirect to login
      set({ user: null, checkingAuth: false });
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isOnLoginPage =
          currentPath === "/login" || currentPath === "/admin/login";

        if (!isOnLoginPage) {
          // Redirect to the correct login page based on current section
          const redirectTo = currentPath.startsWith("/admin")
            ? "/admin/login"
            : "/login";
          window.location.href = redirectTo;
        }
      }
      throw error;
    }
  },*/
}));
