import { create } from "zustand";
import { contactService } from "@/lib/api/auth";

const FILE_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.arnio.co/api/v1";
const useWorkspaceStore = create((set, get) => ({
  loadContacts: async (options = {}) => {
    const {
      page = 1,
      limit = 20,
      search = "all",
      status = "active",
      labels = "any",
      sortBy = "createdAt",
      sortOrder = "desc",
      append = false,
    } = options;

    try {
      const response = await contactService.getAllContacts({
        page,
        limit,
        search,
        status,
        labels,
        sortBy,
        sortOrder,
      });

      const data = response?.data || response;
      const contacts = Array.isArray(data.contacts) ? data.contacts : data;

      const mappedConversations = contacts.map((c) => {
        // Handle last message safely
        let lastMessageText = "";
        let lastMessageTime = null;

        if (typeof c.lastMessage === "string") {
          lastMessageText = c.lastMessage;
        } else if (c.lastMessage && typeof c.lastMessage === "object") {
          lastMessageText = c.lastMessage.message || c.lastMessage.text || "";
          lastMessageTime =
            c.lastMessage.timestamp ||
            c.lastMessage.createdAt ||
            c.updatedAt ||
            new Date();
        }

        // Format initial messages from backend
        const formattedMessages = Array.isArray(c.messages)
          ? c.messages
              .map((msg) => {
                const direction = (msg.direction || "").toLowerCase();
                const isIncoming =
                  direction === "inbound" || direction === "in";
                let type = "text";
                let attachment = null;

                if (
                  Array.isArray(msg.attachments) &&
                  msg.attachments.length > 0
                ) {
                  const att = msg.attachments[0];
                  attachment = {
                    fileName: att.transferName || att.fileName || "",
                    mimeType: att.mimeType || "",
                    url: `${FILE_BASE_URL}/contacts/${c.id}/attachments/${att.guid}`,
                    size: att.size || att.totalBytes || null,
                  };
                  const mime = attachment.mimeType || "";
                  if (mime.startsWith("audio/") || mime.startsWith("video/"))
                    type = "audio";
                  else if (
                    mime.startsWith("image/") ||
                    mime.startsWith("application/")
                  )
                    type = "file";
                }

                return {
                  id: msg.id,
                  text: msg.message ?? msg.text ?? "",
                  isIncoming,
                  type,
                  fileUrl: attachment?.url || "",
                  fileType: attachment?.mimeType || "",
                  fileName: attachment?.fileName || "",
                  fileSize: attachment?.size || 0,
                  timestamp: msg.timestamp || msg.createdAt || null,
                  status: msg.status?.read
                    ? "read"
                    : msg.status?.delivered
                    ? "delivered"
                    : "sent",
                  service: msg.service || null,

                  // Add these for audio
                  audioUrl:
                    type === "audio" ? attachment?.url || "" : undefined,
                  duration: null, // optional, can be set when played
                };
              })
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          : [];

        return {
          id: c.id,
          name: c.name || "Unknown",
          phoneNumber: c.phone || "",
          email: c.email || "",
          deviceType: c.isIMessageAvailable ? "apple" : "android",
          lastMessage: lastMessageText,
          lastMessageTime: lastMessageTime
            ? new Date(lastMessageTime)
            : c.updatedAt
            ? new Date(c.updatedAt)
            : new Date(),
          unreadCount: c.unreadCount || 0,
          status: c.status || "ACTIVE",
          fromPhoneNumber: c.fromPhoneNumber || null,
          messages: formattedMessages, // store initial messages
          hasMoreMessages: formattedMessages.length >= 20, // assume pagination if more exist
        };
      });

      if (append) {
        set((state) => ({
          conversations: [...state.conversations, ...mappedConversations],
          pagination: {
            page: data.page || page,
            limit: data.limit || limit,
            total: data.total || state.pagination.total,
          },
        }));
      } else {
        set({
          conversations: mappedConversations,
          pagination: {
            page: data.page || page,
            limit: data.limit || limit,
            total: data.total || mappedConversations.length,
          },
        });
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  },

  // Load messages for a specific contact (from backend)
  // inside your store
  loadMessages: async (contactId, options = {}) => {
    const { page = 1, limit = 20, append = false } = options;

    try {
      const response = await contactService.getMessages({
        contactId,
        page,
        limit,
      });
      const messages = response?.messages || [];

      const formattedMessages = messages.map((msg) => {
        const direction = (msg.direction || "").toLowerCase();
        const isIncoming = direction === "inbound" || direction === "in";
        let type = "text";
        let attachment = null;

        if (Array.isArray(msg.attachments) && msg.attachments.length > 0) {
          const att = msg.attachments[0];
          attachment = {
            fileName: att.transferName || att.fileName || "",
            mimeType: att.mimeType || "",
            url: `${API_BASE_URL}/contacts/${contactId}/attachments/${att.guid}`,
            size: att.size || att.totalBytes || null,
          };
          const mime = attachment.mimeType || "";
          if (mime.startsWith("audio/") || mime.startsWith("video/"))
            type = "audio";
          else if (mime.startsWith("image/") || mime.startsWith("application/"))
            type = "file";
        }

        return {
          id: msg.id,
          text: msg.message ?? msg.text ?? "",
          isIncoming,
          type,
          fileUrl: attachment?.url || "",
          fileType: attachment?.mimeType || "",
          fileName: attachment?.fileName || "",
          fileSize: attachment?.size || 0,
          timestamp: msg.timestamp || msg.createdAt || null,
          status: msg.status?.read
            ? "read"
            : msg.status?.delivered
            ? "delivered"
            : "sent",
          service: msg.service || null,
          audioUrl: type === "audio" ? attachment?.url || "" : undefined,
          duration: null, // optional, can be set when played
        };
      });

      const sortedMessages = formattedMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id !== contactId) return conv;

          const existing = conv.messages || [];
          const hasMore = messages.length === limit;

          let newMessages;
          if (append) {
            // Only add messages that don't already exist
            const existingIds = new Set(existing.map((m) => m.id));
            const filtered = sortedMessages.filter(
              (m) => !existingIds.has(m.id)
            );
            newMessages = [...filtered, ...existing];
          } else {
            newMessages = sortedMessages;
          }

          return {
            ...conv,
            messages: newMessages,
            hasMoreMessages: hasMore,
          };
        }),
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  },

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
  conversations: [],
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

  // File Upload State
  fileUploads: {}, // conversationId -> array of file uploads
  voiceMessages: {}, // conversationId -> voice message state

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
      assignedTo: get().currentUser.id,
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

  setActiveConversation: async (conversation) => {
    const state = get();
    // const { loadMessages } = get();

    try {
      // Set the active conversation ID first
      set({ activeConversationId: conversation.id });

      // Then load its messages
      // await loadMessages(conversation.id);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  },

  getActiveConversation: () => {
    const state = get();
    return (
      state.conversations.find(
        (conv) =>
          conv.id === state.activeConversationId ||
          conv.phoneNumber === state.activeConversationId
      ) || null
    );
  },

  sendMessage: async (
    conversationId,
    activeConversation,
    text,
    origin = "manual",
    fileData = null,
    voiceData = null
  ) => {
    const state = get();

    // 1. Prepare payload
    const payload = {
      phoneNumber: activeConversation,
      message: text,
      contactId: conversationId,
    };

    if (fileData?.file) payload.file = fileData.file;
    if (voiceData?.blob) payload.voiceData = voiceData;

    // 2. Optimistically add message to local state
    const newMsg = {
      id: Date.now().toString(),
      isIncoming: false,
      fileName: fileData?.file?.name,
      text: text || fileData?.file?.type || "Voice Message",
      type: fileData ? "file" : voiceData ? "audio" : "text",
      fileUrl: fileData?.url || null, // 👈 use blob URL for instant preview

      origin,
      fileSize: fileData?.size,
      status: "sending",
      timestamp: new Date().toISOString(),
      audioUrl: voiceData?.audioUrl,
    };

    set({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...(conv.messages || []), newMsg] }
          : conv
      ),
    });

    // 3. Send to backend
    try {
      const result = await contactService.sendMessage(payload);

      // Update message status → "sent"
      set({
        conversations: get().conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === newMsg.id
                    ? {
                        ...m,
                        status: "sent",
                        fileUrl:
                          result?.fileGuid && conversationId
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/${conversationId}/attachments/${result.fileGuid}`
                            : m.fileUrl, // keep blob URL until backend response
                      }
                    : m
                ),
              }
            : conv
        ),
      });
      console.log("Message sent:", result);
    } catch (err) {
      console.error("Send failed:", err);
      set({
        conversations: get().conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === newMsg.id ? { ...m, status: "failed" } : m
                ),
              }
            : conv
        ),
      });
    }
  },

  deleteConversation: async (contactId) => {
    try {
      await contactService.deleteChat(contactId);
      // Remove conversation from local state
      set((state) => {
        const updatedConversations = state.conversations.filter(
          (c) => c.id !== contactId
        );
        return {
          conversations: updatedConversations,
          activeConversationId: null,
        };
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("Failed to delete chat. Please try again.");
    }
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

  // ===== ANALYTICS METHODS (migrated from analyticsStore) =====

  setDateRange: (range) => set({ dateRange: range }),
  toggleCalendar: () =>
    set((state) => ({
      ui: { ...state.ui, showCalendar: !state.ui.showCalendar },
    })),
  toggleExportDropdown: () =>
    set((state) => ({
      ui: { ...state.ui, showExportDropdown: !state.ui.showExportDropdown },
    })),
  setHoveredPoint: (point) =>
    set((state) => ({
      ui: { ...state.ui, hoveredPoint: point },
    })),
  setHasData: (hasData) =>
    set((state) => ({
      ui: { ...state.ui, hasData },
    })),

  loadData: async () => {
    set((state) => ({
      ui: { ...state.ui, hasData: false },
    }));
    setTimeout(() => {
      set((state) => ({
        ui: { ...state.ui, hasData: true },
      }));
    }, 1000);
  },

  // ===== WORKSPACE-SPECIFIC METHODS =====

  // Get team member avatars for profile dropdown
  getTeamMemberAvatars: () => {
    const state = get();
    return state.teamMembers.map((member) => member.avatar);
  },

  // Get online team members
  getOnlineTeamMembers: () => {
    const state = get();
    return state.teamMembers.filter((member) => member.status === "online");
  },

  // Update team member status
  updateTeamMemberStatus: (memberId, status) => {
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === memberId
          ? { ...member, status, lastActive: new Date() }
          : member
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
      teamMembers: state.teamMembers.filter((member) => member.id !== memberId),
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
    return state.conversations.filter(
      (conv) => conv.assignedTo === state.currentUser.id
    );
  },

  // Assign conversation to team member
  assignConversation: (conversationId, memberId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
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
      onlineTeamMembers: state.teamMembers.filter((m) => m.status === "online")
        .length,
      totalConversations: state.conversations.length,
      activeConversations: state.conversations.filter((c) => c.unreadCount > 0)
        .length,
    };
  },

  // ===== FILE UPLOAD METHODS =====

  // Add file to upload queue
  addFileUpload: (conversationId, file) => {
    const uploadId = `upload-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const fileUpload = {
      id: uploadId,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading", // uploading, success, error
      progress: 0,
      error: null,
      url: null,
    };

    set((state) => ({
      fileUploads: {
        ...state.fileUploads,
        [conversationId]: [
          ...(state.fileUploads[conversationId] || []),
          fileUpload,
        ],
      },
    }));

    // Simulate upload process
    get().simulateFileUpload(conversationId, uploadId);
    return uploadId;
  },

  // Simulate file upload with progress
  simulateFileUpload: (conversationId, uploadId) => {
    const updateProgress = (progress) => {
      set((state) => ({
        fileUploads: {
          ...state.fileUploads,
          [conversationId]: state.fileUploads[conversationId]?.map((upload) =>
            upload.id === uploadId ? { ...upload, progress } : upload
          ),
        },
      }));
    };

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Simulate success or failure (90% success rate)
        const isSuccess = Math.random() > 0.1;

        set((state) => ({
          fileUploads: {
            ...state.fileUploads,
            [conversationId]: state.fileUploads[conversationId]?.map((upload) =>
              upload.id === uploadId
                ? {
                    ...upload,
                    progress: 100,
                    status: isSuccess ? "success" : "error",
                    error: isSuccess ? null : "Upload failed. Try again.",
                    url: isSuccess ? URL.createObjectURL(upload.file) : null,
                  }
                : upload
            ),
          },
        }));
      } else {
        updateProgress(progress);
      }
    }, 200);
  },

  // Remove file upload
  removeFileUpload: (conversationId, uploadId) => {
    set((state) => ({
      fileUploads: {
        ...state.fileUploads,
        [conversationId]: state.fileUploads[conversationId]?.filter(
          (upload) => upload.id !== uploadId
        ),
      },
    }));
  },

  // Retry file upload
  retryFileUpload: (conversationId, uploadId) => {
    set((state) => ({
      fileUploads: {
        ...state.fileUploads,
        [conversationId]: state.fileUploads[conversationId]?.map((upload) =>
          upload.id === uploadId
            ? { ...upload, status: "uploading", progress: 0, error: null }
            : upload
        ),
      },
    }));

    get().simulateFileUpload(conversationId, uploadId);
  },

  // Get file uploads for conversation
  getFileUploads: (conversationId) => {
    const state = get();
    return state.fileUploads[conversationId] || [];
  },

  // Clear all file uploads for conversation
  clearFileUploads: (conversationId) => {
    set((state) => ({
      fileUploads: {
        ...state.fileUploads,
        [conversationId]: [],
      },
    }));
  },

  // ===== VOICE MESSAGE METHODS =====

  // Start voice recording
  startVoiceRecording: (conversationId) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: {
          isRecording: true,
          duration: 0,
          audioBlob: null,
        },
      },
    }));
  },

  // Stop voice recording
  stopVoiceRecording: (conversationId, audioBlob) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: {
          isRecording: false,
          duration: 0,
          audioBlob,
        },
      },
    }));
  },

  // Update voice recording duration
  updateVoiceDuration: (conversationId, duration) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: {
          ...state.voiceMessages[conversationId],
          duration,
        },
      },
    }));
  },

  // Clear voice message
  clearVoiceMessage: (conversationId) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: null,
      },
    }));
  },

  // Get voice message state
  getVoiceMessageState: (conversationId) => {
    const state = get();
    return state.voiceMessages[conversationId] || null;
  },

  // Enhanced voice message methods with real-time support
  setVoiceRecordingStream: (conversationId, stream) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: {
          ...state.voiceMessages[conversationId],
          stream,
        },
      },
    }));
  },

  setVoiceWaveformData: (conversationId, waveformData) => {
    set((state) => ({
      voiceMessages: {
        ...state.voiceMessages,
        [conversationId]: {
          ...state.voiceMessages[conversationId],
          waveformData,
        },
      },
    }));
  },
}));

export { useWorkspaceStore };
