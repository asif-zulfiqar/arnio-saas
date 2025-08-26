import { useConversationStore } from "@/store/conversation/conversationStore";
import { Paperclip, Plus, Send, Smile } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ButtonWithTooltip, { Dropdown } from "./ButtonWithTooltip";

const ConversationBox = ({ onStartConversation }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { activeConversationId, getActiveConversation, sendMessage } =
    useConversationStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const activeConversation = getActiveConversation();

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleMoveChat = () => {
    // Toggle dropdown visibility
    setDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, message.trim());
    setMessage("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getInitials = (name) => {
    return `${name.charAt(0).toUpperCase()}${name.charAt(1).toUpperCase()}`;
  };

  // Show empty state when no active conversation
  if (!activeConversation) {
    return (
      <div className="flex-1 w-full grid place-items-center bg-white rounded-2xl shadow-sm">
        <div>
          <Image
            src="/svgs/empty.svg"
            width={234}
            height={228}
            alt="No conversations"
          />
          <h5 className="text-gray-900 text-base font-medium text-center mt-5">
            No conversations yet
          </h5>
          <p className="text-gray-400 text-sm text-center mt-1">
            Start a new chat to begin messaging.
          </p>
          <button
            onClick={onStartConversation}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[210px] h-[34px] mx-auto hover:bg-blue-50 transition-colors"
          >
            <Plus className="size-[10px] text-primary" />
            Start Your First Conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center relative">
            <span className="text-white font-medium text-sm">
              {getInitials(activeConversation.name)}
            </span>
            <div
              className={`absolute -bottom-[1px] -right-[1px] size-3 rounded-full border-[1.5px] border-white ${
                activeConversation.status === "online"
                  ? "bg-green-600"
                  : activeConversation.status === "offline"
                  ? "bg-gray-300"
                  : "bg-[#3F83F8]"
              }`}
            ></div>
          </div>
          <div>
            <h3 className="font-medium text-base text-gray-900">
              {activeConversation.name}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              {activeConversation.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ButtonWithTooltip
            iconSrc="/svgs/phone.svg"
            tooltipText="Make a call"
          />
          <ButtonWithTooltip
            iconSrc="/svgs/folder-arrow-right.svg"
            tooltipText="Move chat"
            onClick={handleMoveChat}
          >
            <Dropdown isOpen={isDropdownOpen} onClose={handleCloseDropdown} />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            iconSrc="/svgs/profile.svg"
            tooltipText="Open Profile"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-0 p-6">
        {activeConversation.messages.length === 0 ? (
          <div className="grid place-items-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-semibold text-xl">
                  {getInitials(activeConversation.name)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {activeConversation.name}
              </h4>
              <p className="text-sm text-gray-500">
                {activeConversation.phoneNumber}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-6 py-5 rounded-[20px] ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {/* <p
                    className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p> */}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a reply ..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationBox;
