import { useConversationStore } from "@/store/conversation/conversationStore";
import { getInitials } from "@/utils/utils";
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
              ? "bg-[#EBF5FF]"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="size-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 relative">
              <span className="text-white font-medium text-sm">
                {getInitials(conversation.name)}
              </span>
              <div
                className={`absolute -bottom-[1px] -right-[1px] size-3 rounded-full border-[1.5px] border-white ${
                  conversation.status === "online"
                    ? "bg-green-600"
                    : conversation.status === "offline"
                    ? "bg-gray-300"
                    : "bg-[#3F83F8]"
                }`}
              ></div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h6 className="font-medium text-sm text-gray-900 truncate">
                  {conversation.name}
                </h6>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {conversation.lastMessageTime &&
                    formatTime(conversation.lastMessageTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate">
                  {conversation.isTyping ? (
                    <span className="text-gray-400">Typing...</span>
                  ) : (
                    conversation.lastMessage || "No messages yet"
                  )}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="bg-[#E1EFFE] text-[#1E429F] text-[10px] font-medium rounded-full size-4 grid place-items-center flex-shrink-0 ml-2">
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
