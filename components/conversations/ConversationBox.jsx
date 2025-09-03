import { useConversationStore } from "@/store/conversation/conversationStore";
import {
  formatMessageDate,
  formatPhoneNumber,
  getFirstName,
  getInitials,
  shouldShowTimestamp,
} from "@/utils/utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ButtonWithTooltip, { Dropdown } from "./ButtonWithTooltip";
import { set } from "date-fns";

const ConversationBox = ({ onStartConversation }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const {
    activeConversationId,
    getActiveConversation,
    sendMessage,
    setPendingMessageToInput,
    setDraftMessage,
  } = useConversationStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const activeConversation = getActiveConversation();

  const handleAIInitialMessage = () => {
    if (!activeConversationId) return;

    const aiMessage = setPendingMessageToInput(activeConversationId);
    setMessage(aiMessage);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleMoveChat = () => {
    // Toggle dropdown visibility
    setDropdownOpen((prevState) => !prevState);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, message.trim());
    setMessage("");
    setDraftMessage(activeConversationId, "");
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (activeConversationId) {
      setDraftMessage(activeConversationId, newMessage);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isLastUserMessage = (currentMsg, messages) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        return messages[i].id === currentMsg.id;
      }
    }
    return false;
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversation) {
      setMessage(activeConversation.draftMessage || "");
    } else {
      setMessage("");
    }
  }, [activeConversationId, activeConversation?.draftMessage]);

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
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
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
              {formatPhoneNumber(activeConversation?.phoneNumber)}
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
          <div className="flex flex-col justify-center h-full">
            <p className="text-center text-base text-gray-500">
              No messages yet
            </p>
            {!message && (
              <div>
                <p className="text-center text-sm text-gray-500 mt-1">
                  Want to start with an AI-generated intro?
                </p>
                <button
                  onClick={handleAIInitialMessage}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[150px] h-[34px] mx-auto hover:bg-blue-50 transition-colors"
                >
                  <Image
                    src="/svgs/ai-icon.svg"
                    width={12}
                    height={14}
                    alt="icon"
                  />
                  AI Initial Message
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeConversation.messages.map((msg, index) => {
              const showTimestamp = shouldShowTimestamp(
                msg,
                index,
                activeConversation.messages
              );
              return (
                <div key={msg.id}>
                  {showTimestamp && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-400">
                        {formatMessageDate(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "user" && (
                      <div className="flex flex-col items-end">
                        <div className="max-w-xs lg:max-w-md px-6 py-5 rounded-[20px] bg-primary text-white">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        {isLastUserMessage(
                          msg,
                          activeConversation.messages
                        ) && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-400">
                              {msg.status === "read" ? "Read" : "Delivered"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.sender !== "user" && (
                      <div className="flex gap-2">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getInitials(activeConversation.name)}
                          </span>
                        </div>
                        <div>
                          <h6 className="text-xs font-medium mb-1">
                            {activeConversation?.name}
                          </h6>
                          <p className="max-w-xs lg:max-w-md px-6 py-5 rounded-[20px] bg-gray-100 text-gray-900 text-sm">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-5">
        <form
          onSubmit={handleSendMessage}
          className="flex flex-col gap-1 border border-gray-100 rounded-2xl"
        >
          <div className="flex-1 relative">
            <textarea
              rows={1}
              name="message"
              id="message"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Write a ${
                activeConversation.messages.length === 0 ? "message" : "reply"
              } ...`}
              className="scroll-0 w-full border-transparent focus:outline-none text-sm text-gray-900 placeholder:text-gray-400 py-6 px-5 resize-none"
            ></textarea>
          </div>
          <div className="flex items-center justify-between px-5 pb-4">
            <div className="flex items-center gap-4">
              <button>
                <Image
                  src="/svgs/paperclip.svg"
                  width={16}
                  height={16}
                  alt="icon"
                />
              </button>
              <button>
                <Image
                  src="/svgs/smile.svg"
                  width={16}
                  height={16}
                  alt="icon"
                />
              </button>
              <button>
                <Image src="/svgs/mic.svg" width={16} height={16} alt="icon" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="disabled:cursor-not-allowed transition-colors"
            >
              <Image src="/svgs/send.svg" width={16} height={16} alt="icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationBox;
