import { generateDummyConversations } from "@/data/data";

const { create } = require("zustand");

const useConversationStore = create((set, get) => ({
  conversations: generateDummyConversations(10),
  activeConversationId: null,
  searchTerm: "",

  addConversation: (name, phoneNumber, generateAiMessage = false) => {
    const id = `convo-${Date.now()}`;
    const newConversation = {
      id,
      phoneNumber,
      name,
      deviceType: "andriod",
      lastMessage: "",
      lastMessageTime: new Date(),
      messages: [],
      isTyping: false,
      unreadCount: 0,
      status: "online",
      pendingAIMessage: null,
      draftMessage: "",
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: id,
    }));

    if (generateAiMessage) {
      setTimeout(() => {
        const firstName = name.split(" ")[0];
        const aiMessage = `Hi ${firstName}, hope you're well! Just wanted to introduce myself — we're working on something I think you'll find useful. Happy to share more if you're interested.`;

        // Directly set the AI message as draft instead of pending
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, draftMessage: aiMessage } : conv
          ),
        }));
      }, 100);
    }

    return id;
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  },

  sendMessage: (conversationId, content, origin = "manual") => {
    const messageId = `msg-${Date.now()}`;
    const message = {
      id: messageId,
      content,
      sender: "user",
      timestamp: new Date(),
      status: "delivered",
      origin,
    };

    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : conv
      );

      // ✅ Move the updated conversation to the top
      const sortedConversations = [
        updatedConversations.find((c) => c.id === conversationId),
        ...updatedConversations.filter((c) => c.id !== conversationId),
      ];

      return { conversations: sortedConversations };
    });

    setTimeout(() => {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, status: "read" } : msg
                ),
              }
            : conv
        ),
      }));

      get().receiveMessage(conversationId, get().generateAutoReply(content));
    }, 8000 + Math.random() * 2000);
  },

  receiveMessage: (conversationId, content) => {
    const messageId = `msg-${Date.now()}`;
    const message = {
      id: messageId,
      content,
      sender: "other",
      timestamp: new Date(),
    };

    const state = get();
    const isActiveConversation = state.activeConversationId === conversationId;

    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: content,
              lastMessageTime: new Date(),
              unreadCount: isActiveConversation ? 0 : conv.unreadCount + 1,
            }
          : conv
      );

      const sortedConversations = [
        updatedConversations.find((c) => c.id === conversationId),
        ...updatedConversations.filter((c) => c.id !== conversationId),
      ];

      return { conversations: sortedConversations };
    });
  },

  setDraftMessageFromAI: (conversationId) => {
    const state = get();
    const conversation = state.conversations.find(
      (conv) => conv.id === conversationId
    );

    if (conversation?.pendingAIMessage) {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                draftMessage: conv.pendingAIMessage,
                pendingAIMessage: null,
              }
            : conv
        ),
      }));
      return conversation.pendingAIMessage;
    }
    return null;
  },

  setDraftMessage: (conversationId, draft) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, draftMessage: draft } : conv
      ),
    }));
  },

  generateAutoReply: (userMessage) => {
    const responses = [
      "Thanks for your message!",
      "That sounds great!",
      "I'll get back to you soon.",
      "Sounds good!",
      "Thanks for letting me know.",
      "Got it, thanks!",
      "I understand.",
      "Perfect, thank you!",
      "I'll take a look at that.",
      "Thanks for the update!",
    ];

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How are you?";
    }
    if (lowerMessage.includes("how") && lowerMessage.includes("you")) {
      return "I'm doing well, thank you! How about you?";
    }
    if (lowerMessage.includes("meeting") || lowerMessage.includes("12 pm")) {
      return "12 PM works perfectly for me!";
    }
    if (lowerMessage.includes("thanks") || lowerMessage.includes("thank you")) {
      return "You're welcome!";
    }

    // Random response for other messages
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // Set typing indicator
  setTyping: (conversationId, isTyping) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, isTyping } : conv
      ),
    }));
  },

  // Generate AI initial message
  generateAIInitialMessage: (conversationId, name) => {
    const firstName = name.split(" ")[0];
    const aiMessage = `Hi ${firstName}, hope you're well! Just wanted to introduce myself — we're working on something I think you'll find useful. Happy to share more if you're interested.`;

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, pendingAIMessage: aiMessage }
          : conv
      ),
    }));
  },

  // Set pending AI message to input
  setPendingMessageToInput: (conversationId) => {
    const state = get();
    const conversation = state.conversations.find(
      (conv) => conv.id === conversationId
    );

    if (conversation?.pendingAIMessage) {
      // Clear the pending message
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, pendingAIMessage: null }
            : conv
        ),
      }));

      return conversation.pendingAIMessage;
    }

    // Generate new AI message if none pending
    const firstName = conversation?.name?.split(" ")[0] || "there";
    return `Hi ${firstName}, hope you're well! Just wanted to introduce myself — we're working on something I think you'll find useful. Happy to share more if you're interested.`;
  },

  // Search conversations
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  // Get filtered conversations
  getFilteredConversations: () => {
    const state = get();
    if (!state.searchTerm) return state.conversations;

    return state.conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        conv.phoneNumber.includes(state.searchTerm) ||
        conv.lastMessage.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  },

  // Get active conversation
  getActiveConversation: () => {
    const state = get();
    return state.conversations.find(
      (conv) => conv.id === state.activeConversationId
    );
  },
}));

export { useConversationStore };
