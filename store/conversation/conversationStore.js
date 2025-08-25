const { conversations } = require("@/data/data");
const { create } = require("zustand");

const useConversationStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  searchTerm: "",

  addConversation: (name, phoneNumber) => {
    const id = `convo-${Date.now()}`;
    const newConversation = {
      id,
      phoneNumber,
      name,
      lastMessage: "",
      lastMessageTime: new Date(),
      messages: [],
      isTyping: false,
      unreadCount: 0,
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: id,
    }));

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

  sendMessage: (conversationId, content) => {
    const messageId = `msg-${Date.now()}`;
    const message = {
      id: messageId,
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : conv
      ),
    }));

    setTimeout(() => {
      get().receiveMessage(conversationId, get().generateAutoReply(content));
    }, 1000 + Math.random() * 2000);
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

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: content,
              lastMessageTime: new Date(),
              unreadCount: isActiveConversation ? 0 : conv.unreadCount + 1,
            }
          : conv
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
