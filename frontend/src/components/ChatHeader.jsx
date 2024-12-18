import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

/**
 * The ChatHeader component renders the header of the chat container.
 * It displays the user's name and their online status.
 * It also has a close button that closes the chat container when clicked.
 *
 * @returns A JSX element representing the ChatHeader component.
 */
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // The user's name and online status
  const userInfo = (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="avatar">
        <div className="size-10 rounded-full relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
          />
        </div>
      </div>

      {/* User info */}
      <div>
        <h3 className="font-medium">{selectedUser.fullName}</h3>
        <p className="text-sm text-base-content/70">
          {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );

  // The close button
  const closeButton = (
    <button onClick={() => setSelectedUser(null)}>
      <X />
    </button>
  );

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {userInfo}
        {closeButton}
      </div>
    </div>
  );
};
export default ChatHeader;