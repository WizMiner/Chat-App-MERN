/**
 * MessageSkeleton component renders a list of skeleton elements
 * to serve as placeholders while loading message data.
 * Each skeleton message alternates between left and right alignment
 * to simulate chat messages.
 *
 * @returns {JSX.Element} The skeleton message list.
 */
const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          // Alternate message alignment: "chat-start" for left, "chat-end" for right
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              {/* Avatar skeleton */}
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          <div className="chat-header mb-1">
            {/* Header skeleton */}
            <div className="skeleton h-4 w-16" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            {/* Message bubble skeleton */}
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default MessageSkeleton;
