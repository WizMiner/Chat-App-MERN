import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

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
  // Function to sign up a user
  signup: async (data) => {
    // Set the signing up state to true
    set({ isSigningUp: true });
    try {
      // Make a POST request to the signup endpoint with the user data
      const res = await axiosInstance.post("/auth/signup", data);

      // Set the authenticated user with the response data
      set({ authUser: res.data });

      // Display a success message
      toast.success("Account created successfully");

      // Connect the user to the socket
      get().connectSocket();
    } catch (error) {
      // Display an error message if signup fails
      toast.error(error.response.data.message);
    } finally {
      // Reset the signing up state to false
      set({ isSigningUp: false });
    }
  },
}));
