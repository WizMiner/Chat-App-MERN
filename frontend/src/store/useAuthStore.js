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
      // Handle error gracefully using optional chaining to avoid undefined errors
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during signup. Please try again.";
      toast.error(errorMessage);
    } finally {
      // Reset the signing up state to false
      set({ isSigningUp: false });
    }
  },

  // Function to log in a user
  login: async (data) => {
    // Set the logging in state to true
    set({ isLoggingIn: true });

    try {
      // Make a POST request to the login endpoint with the user data
      const res = await axiosInstance.post("/auth/login", data);

      // Set the authenticated user with the response data
      set({ authUser: res.data });

      // Display a success message
      toast.success("Logged in successfully");

      // Connect the user to the socket
      get().connectSocket();
    } catch (error) {
      // Handle error gracefully using optional chaining to avoid undefined errors
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during login. Please try again.";
      toast.error(errorMessage);
    } finally {
      // Reset the logging in state to false
      set({ isLoggingIn: false });
    }
  },

  // Function to log out a user
  logout: async () => {
    set({ isLoggingOut: true });

    try {
      // Make a POST request to the logout endpoint
      await axiosInstance.post("/auth/logout");

      // Set the authenticated user state to null
      set({ authUser: null });
      toast.success("Logged out successfully");

      // Disconnect the user from the socket
      get().disconnectSocket();
    } catch (error) {
      // Handle error gracefully using optional chaining to avoid undefined errors
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during logout. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingOut: false });
    }
  },
  /**
   * Function to update the user's profile information.
   * @param {Object} data - The user data to be updated.
   * @returns {Promise} - A promise that resolves when the request is completed.
   */
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // Make a PUT request to the update-profile endpoint with the user data
      const res = await axiosInstance.put("/auth/update-profile", data);

      // Set the authenticated user state with the response data
      set({ authUser: res.data });

      // Display a success message
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);

      // Handle error gracefully using optional chaining to avoid undefined errors
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during profile update. Please try again.";
      toast.error(errorMessage);
    } finally {
      // Reset the updating profile state to false
      set({ isUpdatingProfile: false });
    }
  },
}));
