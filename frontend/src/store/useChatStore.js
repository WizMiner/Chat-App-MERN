import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  /**
   * Fetches the list of users from the server.
   * Sets the loading state while the request is in progress.
   * Updates the users state with the fetched data.
   * Displays an error toast if the request fails.
   */
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      // Make a GET request to fetch users
      const res = await axiosInstance.get("/messages/users");
      // Update the users state with response data
      set({ users: res.data });
    } catch (error) {
      // Display an error message if the request fails
      toast.error(error.response.data.message);
    } finally {
      // Reset the loading state
      set({ isUsersLoading: false });
    }
  },

  /**
   * Fetches the list of messages for the given user.
   * Sets the loading state while the request is in progress.
   * Updates the messages state with the fetched data.
   * Displays an error toast if the request fails.
   * @param {string} userId - The ID of the user to fetch messages for.
   */
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // Make a GET request to fetch messages
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Update the messages state with response data
      set({ messages: res.data });
    } catch (error) {
      // Display an error message if the request fails
      toast.error(error.response.data.message);
    } finally {
      // Reset the loading state
      set({ isMessagesLoading: false });
    }
  },
  /**
   * Sends a message to the selected user.
   * Makes a POST request to the server with the message data.
   * Updates the messages state with the new message.
   * Displays an error toast if the request fails.
   * @param {object} messageData - The message data to be sent.
   * The message data should contain the following keys:
   * {
   *   content: string,
   *   type: "text" | "image",
   *   image: string (optional)
   * }
   */
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  /**
   * Subscribes to new message events.
   * This sets up a listener for the "newMessage" event on the socket.
   * When a new message is received, it updates the messages state with the new message.
   * The listener checks if the incoming message is from the selected user before updating the state.
   */
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // Set up a listener for the "newMessage" event
    socket.on("newMessage", (newMessage) => {
      // Check if the incoming message is from the selected user
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      // Update the messages state with the new message
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  /**
   * Unsubscribes from receiving new message events.
   * This stops listening to incoming "newMessage" events from the socket.
   */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    // Remove listener for "newMessage" event
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));