import { generateDummyConversations } from "@/data/data";
import { create } from "zustand";

const useWorkspaceStore = create((set, get) => ({
  // Workspace Information
  currentWorkspace: {
    id: "workspace-1",
    name: "Meadowfield",
    description: "Main workspace for customer communications",
    createdAt: new Date(),
    settings: {
      timezone: "UTC",
      workingHours: { start: "09:00", end: "17:00" },
      autoReply: true,
      aiAssistance: true,
    },
  },

  // Team Members (Users in the workspace)
  teamMembers: [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@meadowfield.com",
      role: "admin",
      avatar: "/images/user1.jpg",
      status: "online",
      lastActive: new Date(),
      permissions: ["read", "write", "admin"],
    },
    {
      id: "user-2", 
      name: "Jane Smith",
      email: "jane@meadowfield.com",
      role: "member",
      avatar: "/images/user2.jpg",
      status: "online",
      lastActive: new Date(),
      permissions: ["read", "write"],
    },
    {
      id: "user-3",
      name: "Mike Johnson", 
      email: "mike@meadowfield.com",
      role: "member",
      avatar: "/images/user3.jpg",
      status: "away",
      lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      permissions: ["read", "write"],
    },
    {
      id: "user-4",
      name: "Sarah Wilson",
      email: "sarah@meadowfield.com", 
      role: "member",
      avatar: "/images/user4.jpg",
      status: "offline",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      permissions: ["read", "write"],
    },
  ],

  // Current User
  currentUser: {
    id: "user-1",
    name: "John Doe",
    email: "john@meadowfield.com",
    role: "admin",
    avatar: "/images/user1.jpg",
    status: "online",
    lastActive: new Date(),
    permissions: ["read", "write", "admin"],
  },

  // Conversations (migrated from conversation store)
  conversations: generateDummyConversations(10),
  activeConversationId: null,
  searchTerm: "",

  // Analytics (migrated from analytics store)
  analytics: {
    customerEngagement: {
      percentage: 67.3,
      change: 1.4,
      isPositive: true,
    },
    chartData: [
      { date: "Jan 31", iMessage: 23, SMS: 15 },
      { date: "Feb 31", iMessage: 42, SMS: 25 },
      { date: "Mar 31", iMessage: 35, SMS: 12 },
      { date: "Apr 31", iMessage: 85, SMS: 72 },
      { date: "May 31", iMessage: 32, SMS: 13 },
      { date: "Jun 31", iMessage: 52, SMS: 35 },
      { date: "Jul 31", iMessage: 32, SMS: 15 },
    ],
    metrics: [
      {
        title: "Messages Sent",
        value: 163,
        change: 30,
        isPositive: true,
        hasChart: true,
      },
      {
        title: "Read Rate",
        value: "8%",
        change: -4,
        isPositive: false,
        hasChart: true,
      },
      {
        title: "Reply Rate",
        value: "14%",
        change: 15,
        isPositive: true,
        hasChart: true,
      },
      {
        title: "Conversion Rate (Orders)",
        value: "58.3%",
        change: -2.4,
        isPositive: false,
        hasChart: true,
      },
      {
        title: "Revenue Driven",
        value: "$595",
        change: 24,
        isPositive: true,
        hasChart: true,
      },
      {
        title: "Click-Through Rate (CTR)",
        value: "12%",
        change: 2,
        isPositive: true,
        hasChart: true,
      },
    ],
  },

  // UI State
  ui: {
    showCalendar: false,
    showExportDropdown: false,
    hoveredPoint: null,
    hasData: true,
  },

  // ===== CONVERSATION METHODS (migrated from conversationStore) =====
  
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
      assignedTo: get().currentUser.id, // Assign to current user
      workspaceId: get().currentWorkspace.id,
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: id,
    }));

    if (generateAiMessage) {
      setTimeout(() => {
        const firstName = name.split(" ")[0];
        const aiMessage = `Hi ${firstName}, hope you're well! Just wanted to introduce myself — we're working on something I think you'll find useful. Happy to share more if you're interested.`;

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
      sentBy: get().currentUser.id, // Track who sent the message
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

    return responses[Math.floor(Math.random() * responses.length)];
  },

  setTyping: (conversationId, isTyping) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, isTyping } : conv
      ),
    }));
  },

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

  setPendingMessageToInput: (conversationId) => {
    const state = get();
    const conversation = state.conversations.find(
      (conv) => conv.id === conversationId
    );

    if (conversation?.pendingAIMessage) {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, pendingAIMessage: null }
            : conv
        ),
      }));

      return conversation.pendingAIMessage;
    }

    const firstName = conversation?.name?.split(" ")[0] || "there";
    return `Hi ${firstName}, hope you're well! Just wanted to introduce myself — we're working on something I think you'll find useful. Happy to share more if you're interested.`;
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

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

  getActiveConversation: () => {
    const state = get();
    return state.conversations.find(
      (conv) => conv.id === state.activeConversationId
    );
  },

  // ===== ANALYTICS METHODS (migrated from analyticsStore) =====

  setDateRange: (range) => set({ dateRange: range }),
  toggleCalendar: () => set((state) => ({ 
    ui: { ...state.ui, showCalendar: !state.ui.showCalendar }
  })),
  toggleExportDropdown: () => set((state) => ({ 
    ui: { ...state.ui, showExportDropdown: !state.ui.showExportDropdown }
  })),
  setHoveredPoint: (point) => set((state) => ({ 
    ui: { ...state.ui, hoveredPoint: point }
  })),
  setHasData: (hasData) => set((state) => ({ 
    ui: { ...state.ui, hasData }
  })),

  loadData: async () => {
    set((state) => ({ 
      ui: { ...state.ui, hasData: false }
    }));
    setTimeout(() => {
      set((state) => ({ 
        ui: { ...state.ui, hasData: true }
      }));
    }, 1000);
  },

  // ===== WORKSPACE-SPECIFIC METHODS =====

  // Get team member avatars for profile dropdown
  getTeamMemberAvatars: () => {
    const state = get();
    return state.teamMembers.map(member => member.avatar);
  },

  // Get online team members
  getOnlineTeamMembers: () => {
    const state = get();
    return state.teamMembers.filter(member => member.status === "online");
  },

  // Update team member status
  updateTeamMemberStatus: (memberId, status) => {
    set((state) => ({
      teamMembers: state.teamMembers.map(member =>
        member.id === memberId ? { ...member, status, lastActive: new Date() } : member
      ),
    }));
  },

  // Add new team member
  addTeamMember: (memberData) => {
    const newMember = {
      id: `user-${Date.now()}`,
      ...memberData,
      status: "offline",
      lastActive: new Date(),
      permissions: ["read", "write"],
    };

    set((state) => ({
      teamMembers: [...state.teamMembers, newMember],
    }));

    return newMember.id;
  },

  // Remove team member
  removeTeamMember: (memberId) => {
    set((state) => ({
      teamMembers: state.teamMembers.filter(member => member.id !== memberId),
    }));
  },

  // Update workspace settings
  updateWorkspaceSettings: (settings) => {
    set((state) => ({
      currentWorkspace: {
        ...state.currentWorkspace,
        settings: { ...state.currentWorkspace.settings, ...settings },
      },
    }));
  },

  // Get conversations assigned to current user
  getMyConversations: () => {
    const state = get();
    return state.conversations.filter(conv => conv.assignedTo === state.currentUser.id);
  },

  // Assign conversation to team member
  assignConversation: (conversationId, memberId) => {
    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, assignedTo: memberId } : conv
      ),
    }));
  },

  // Get analytics for current workspace
  getWorkspaceAnalytics: () => {
    const state = get();
    return {
      ...state.analytics,
      totalTeamMembers: state.teamMembers.length,
      onlineTeamMembers: state.teamMembers.filter(m => m.status === "online").length,
      totalConversations: state.conversations.length,
      activeConversations: state.conversations.filter(c => c.unreadCount > 0).length,
    };
  },
}));

export { useWorkspaceStore };
