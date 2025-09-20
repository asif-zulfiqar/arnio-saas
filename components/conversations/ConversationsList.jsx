import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { getInitials } from "@/utils/utils";
import { formatDistanceToNow } from "date-fns";
import Spinner from "../global/small/Spinner";
import { ArrowDown } from "@/app/assets/svgs/icons";

const ConversationsList = ({ isLoading }) => {
  const {
    activeConversationId,
    setActiveConversation,
    getFilteredConversations,
    searchTerm,
  } = useWorkspaceStore();

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

  if (isLoading) {
    return (
      <div className="overflow-y-auto scroll-0 flex-1">
        <div className="grid place-items-center h-full">
          <Spinner />
        </div>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="overflow-y-auto scroll-0 flex-1">
        <span className="grid place-items-center h-full text-base text-gray-500">
          {searchTerm ? `No results found for "${searchTerm}"` : "No chats yet"}
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
                className={`absolute -bottom-[1px] -right-[1px] size-3 rounded-full border-[1.5px] border-white group ${
                  conversation.deviceType === "andriod"
                    ? "bg-green-600"
                    : conversation.deviceType === "apple"
                    ? "bg-[#3F83F8]"
                    : "bg-gray-300"
                }`}
              >
                <span className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-20 transition-all duration-300 ease-in-out text-nowrap">
                  {conversation.deviceType === "andriod"
                    ? "use SMS"
                    : conversation.deviceType === "apple"
                    ? "use iMessage"
                    : "Unknown"}
                  <span className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <ArrowDown />
                  </span>
                </span>
              </div>
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
