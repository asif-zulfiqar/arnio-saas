import { useConversationStore } from "@/store/conversation/conversationStore";
import { formatDistanceToNow } from "date-fns";

const ConversationsList = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    getFilteredConversations,
  } = useConversationStore();

  const filteredConversations = getFilteredConversations();

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    // Otherwise show relative time
    return formatDistanceToNow(messageDate, { addSuffix: false });
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  if (filteredConversations.length === 0) {
    return (
      <div className="overflow-y-auto scroll-0 flex-1">
        <span className="grid place-items-center h-full text-base text-gray-500">
          No chats yet
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto scroll-0 flex-1">
      {filteredConversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => setActiveConversation(conversation.id)}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeConversationId === conversation.id
              ? "bg-blue-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-lg">
                {getInitials(conversation.name)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h6 className="font-semibold text-gray-900 truncate">
                  {conversation.name}
                </h6>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {conversation.lastMessageTime &&
                    formatTime(conversation.lastMessageTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.isTyping ? (
                    <span className="text-primary">Typing...</span>
                  ) : (
                    conversation.lastMessage || "No messages yet"
                  )}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center flex-shrink-0 ml-2">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
