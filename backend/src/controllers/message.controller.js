import User from "../models/user.model.js";

// Get users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get messages
export const getMessages = async (req, res) => {
  try {
    // Get the IDs of the logged in user and the user to get messages with
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Find all messages between the two users
    const messages = await Message.find({
      // Use the $or operator to find messages where the sender is the logged in user
      // and the receiver is the user to get messages with, or vice versa
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Return the messages in the response
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
