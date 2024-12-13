import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Function to set the authUser state
  checkAuth: async () => {
    try {
      // Check if the user is authenticated by making a GET request to /auth/check
      const res = await axiosInstance.get("/auth/check");

      // If the user is authenticated, retrieve the user object and connect to the socket
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      // If the user is not authenticated, set the authUser state to null
      set({ authUser: null });
    } finally {
      // Set the isCheckingAuth state to false when the operation is complete
      set({ isCheckingAuth: false });
    }
  },
}));
