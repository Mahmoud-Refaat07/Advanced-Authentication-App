import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, data);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Error signing up";

      set({
        error: message,
        isLoading: false,
      });
    }
  },

  login: async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      console.log(response);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
}));
