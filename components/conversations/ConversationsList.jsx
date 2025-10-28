import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { getInitials } from "@/utils/utils";
import { formatDistanceToNow } from "date-fns";
import Spinner from "../global/small/Spinner";
import { ArrowDown } from "@/app/assets/svgs/icons";
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import useAuthStore from "@/store/auth/authStore";

const ConversationsList = ({ isLoading }) => {
  const { user } = useAuthStore();

  const {
    activeConversationId,
    setActiveConversation,
    getFilteredConversations,
    searchTerm,
    conversations,
    loadContacts,
  } = useWorkspaceStore();

  useEffect(() => {
    loadContacts(); // fetch contacts on mount
  }, [loadContacts]);

  useSocket(user?.id, (incomingEvent) => {
    console.log("📩 Socket event received:", incomingEvent);
    if (!incomingEvent) return;

    const { event, data, chat, message } = incomingEvent;

    // --- 🟢 Typing Indicator ---
    if (event?.type === "typing-indicator" && data?.guid) {
      const phoneNumber = data.guid.split(";").pop();
      if (!phoneNumber) return;

      const isTyping = data.display === true;

      useWorkspaceStore.setState((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.phoneNumber === phoneNumber ? { ...conv, isTyping } : conv
        ),
      }));

      const typingTimeouts = {}; // at top of file, outside component

      if (isTyping) {
        clearTimeout(typingTimeouts[phoneNumber]);
        typingTimeouts[phoneNumber] = setTimeout(() => {
          useWorkspaceStore.setState((state) => {
            const index = state.conversations.findIndex(
              (conv) => conv.phoneNumber === phoneNumber
            );
            if (index === -1) return state;

            const newConversations = [...state.conversations];
            newConversations[index] = {
              ...state.conversations[index],
              isTyping: false,
            };
            return { conversations: newConversations };
          });
          delete typingTimeouts[phoneNumber];
        }, 5000);
      }
    }

    // --- 🟡 Message Created ---
    if (event?.type === "message.created" && message && chat) {
      const phoneNumber = chat.displayName || message.externalNumber;
      if (!phoneNumber) return;

      useWorkspaceStore.setState((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.phoneNumber !== phoneNumber) return conv;

          const newMsg = {
            id: message.id,
            text: message.text || "",
            isIncoming: message.direction === "inbound",
            type: "text",
            timestamp: message.createdAt || new Date().toISOString(),
            status: "delivered",
            service: message.service || null,
          };

          const alreadyExists = conv.messages?.some((m) => m.id === newMsg.id);

          const updatedMessages = alreadyExists
            ? conv.messages
            : [...(conv.messages || []), newMsg];

          const lastMsg = updatedMessages[updatedMessages.length - 1];

          return {
            ...conv,
            isTyping: false, // clear typing
            messages: updatedMessages,
            lastMessage: lastMsg.text || lastMsg.fileName || conv.lastMessage,
            lastMessageTime: lastMsg.timestamp || conv.lastMessageTime,
          };
        }),
      }));
    }

    // Message Updated
    if (event?.type === "message.updated" && message && chat) {
      const phoneNumber = chat.displayName || message.externalNumber;
      if (!phoneNumber) return;

      useWorkspaceStore.setState((state) => {
        return {
          conversations: state.conversations.map((conv) => {
            if (conv.phoneNumber !== phoneNumber) return conv;

            // Find the message index
            const msgIndex = conv.messages?.findIndex(
              (m) => m.id === message.id
            );

            // If the message doesn't exist yet, append it
            if (msgIndex === -1) {
              const newMsg = {
                id: message.id,
                text: message.text || "",
                isIncoming: message.direction === "inbound",
                type: "text",
                timestamp: message.updatedAt || new Date().toISOString(),
                status: message.status?.read
                  ? "read"
                  : message.status?.delivered
                  ? "delivered"
                  : "delivered",
                service: message.sender?.service || null,
              };

              const updatedMessages = [...(conv.messages || []), newMsg];
              const lastMsg = updatedMessages[updatedMessages.length - 1];

              return {
                ...conv,
                messages: updatedMessages,
                lastMessage: lastMsg.text || conv.lastMessage,
                lastMessageTime: lastMsg.timestamp || conv.lastMessageTime,
              };
            }

            // Update existing message
            const oldMsg = conv.messages[msgIndex];
            const updatedMsg = {
              ...oldMsg,
              // text: message.text || oldMsg.text,
              status: message.status?.read
                ? "read"
                : message.status?.delivered
                ? "delivered"
                : oldMsg.status,
              timestamp: message.updatedAt || oldMsg.timestamp,
            };

            const updatedMessages = [...conv.messages];
            updatedMessages[msgIndex] = updatedMsg;

            // Sort messages chronologically
            const sortedMessages = updatedMessages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            const lastMsg = sortedMessages[sortedMessages.length - 1];

            return {
              ...conv,
              // messages: sortedMessages,
              lastMessage: conv.lastMessage,
              lastMessageTime: lastMsg.timestamp || conv.lastMessageTime,
            };
          }),
        };
      });
    }
  });

  const handleScroll = (e) => {
    const el = e.target;
    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (scrollBottom < 50) {
      const { page, total, limit } = pagination;
      if (conversations.length < total) {
        loadContacts({ page: page + 1, limit, append: true }); // append: true tells the store to append new contacts
      }
    }
  };

  const filteredConversations = getFilteredConversations();

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
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
    <div className="overflow-y-auto scroll-0 flex-1" onScroll={handleScroll}>
      {filteredConversations.map((conversation) => (
        <div
          key={conversation?.id}
          onClick={() => setActiveConversation(conversation)}
          className={`px-6 py-4 cursor-pointer transition-colors ${
            activeConversationId === conversation?.id
              ? "bg-[#EBF5FF]"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="size-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 relative">
              <span className="text-white font-medium text-sm">
                {getInitials(conversation?.name)}
              </span>
              <div
                className={`absolute -bottom-[1px] -right-[1px] size-3 rounded-full border-[1.5px] border-white group ${
                  conversation?.deviceType === "andriod"
                    ? "bg-green-600"
                    : conversation?.deviceType === "apple"
                    ? "bg-[#3F83F8]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-[calc(100%+8px)] ${
                    conversation?.deviceType === "unknown"
                      ? "left-1/2"
                      : "left-[33px]"
                  } transform -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-50 transition-all duration-300 ease-in-out text-nowrap`}
                >
                  {conversation?.deviceType === "andriod"
                    ? "SMS Enabled"
                    : conversation?.deviceType === "apple"
                    ? "iMessage Enabled"
                    : "Unknown"}
                  <span
                    className={`absolute -top-2 ${
                      conversation?.deviceType === "unknown"
                        ? "left-1/2"
                        : conversation?.deviceType === "andriod"
                        ? "left-[32px]"
                        : "left-[44px]"
                    } transform -translate-x-1/2`}
                  >
                    <ArrowDown />
                  </span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h6 className="font-medium text-sm text-gray-900 truncate">
                  {conversation?.name}
                </h6>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {conversation?.lastMessageTime &&
                    formatTime(conversation?.lastMessageTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate">
                  {conversation?.isTyping ? (
                    <span className="text-gray-400">Typing...</span>
                  ) : (
                    conversation?.lastMessage || "No messages yet"
                  )}
                </p>

                {conversation?.unreadCount > 0 && (
                  <span className="bg-[#E1EFFE] text-[#1E429F] text-[10px] font-medium rounded-full size-4 grid place-items-center flex-shrink-0 ml-2">
                    {conversation?.unreadCount}
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
