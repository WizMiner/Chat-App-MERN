import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

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
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    } finally {
      // Reset the logging in state to false
      set({ isLoggingIn: false });
    }
  },

  // Function to log out a user
  logout: async () => {
    try {
      // Make a POST request to the logout endpoint
      await axiosInstance.post("/auth/logout");

      // Set the authenticated user state to null
      set({ authUser: null });
      toast.success("Logged out successfully");

      // Disconnect the user from the socket
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    } finally {
      // Reset the updating profile state to false
      set({ isUpdatingProfile: false });
    }
  },

  /**
   * Establishes a socket connection for the authenticated user.
   * If the user is not authenticated or already connected, the function returns early.
   * It sets up the socket with the user's ID and listens for online user updates.
   */
  connectSocket: () => {
    // Retrieve the authenticated user
    const { authUser } = get();
    // Return early if the user is not authenticated or the socket is already connected
    if (!authUser || get().socket?.connected) return;

    // Create a new socket instance with the user ID as a query parameter
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    // Connect the socket
    socket.connect();

    // Update the socket state in the store
    set({ socket: socket });

    // Set up a listener for the "getOnlineUsers" event to update the online users list
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
