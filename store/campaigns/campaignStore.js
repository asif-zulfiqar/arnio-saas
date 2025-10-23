import { create } from "zustand";
import { campaignService } from "@/lib/api/campaigns";
import campaignToaster from "@/utils/campaignToast";

const useCampaignStore = create((set, get) => ({
  campaigns: [],
  loading: false,
  error: null,
  currentCampaignId: null,

  // Modal & Creation Flow State
  showCreateCampaignModal: false,
  createCampaignStep: null,
  campaignFormData: null,
  stepHistory: [],

  // Contact Flow State
  contactMethod: null,
  accumulatedContacts: [],
  currentMethodContacts: [],

  // Ciara Agent Setup Data
  campaignType: "",
  ecommerceType: "",
  tone: 0.5,
  businessInfo:
    "We sell affordable, high-quality fashion basics.\nIf customer hesitates, remind them about our 30-day return policy.\nTone: friendly, casual, supportive.",
  firstMessage:
    "Hey {{FirstName}}, noticed you left something in your cart 👀 Want me to save it for you?",
  customCampaignIdea: "",

  // Edit mode state
  isEditMode: false,
  editingCampaignId: null,
  editSource: null,

  // Scheduling State
  selectedPhoneNumbers: [],
  campaignStartDate: null,
  dailySendingCapacity: 100,
  estimatedCompletion: null,

  // Phone Numbers State
  availablePhones: [],
  campaignSenders: [],

  // Campaign List State
  campaignsLoading: false,
  campaignsError: null,
  campaignsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasMore: false,
  },
  searchQuery: "",

  // AI Content State
  aiGeneratedContent: null,
  isGeneratingContent: false,

  // Campaign Summary State
  campaignSummary: null,

  // Options State
  campaignTypes: [],
  businessTypes: [],
  toneOptions: [],

  // ========== HELPER FUNCTIONS ==========

  // Helper to get the correct campaign ID (edit mode vs create mode)
  getTargetCampaignId: () => {
    const state = get();
    return state.editingCampaignId || state.currentCampaignId;
  },

  // ========== API ACTIONS ==========

  // Campaign Creation
  createBasicCampaign: async (campaignData) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.createBasicCampaign(campaignData);
      const campaign = response.data;

      set({
        currentCampaignId: campaign.id,
        loading: false,
      });

      return { success: true, campaign };
    } catch (error) {
      const errorMessage = error.message || "Failed to create campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Main Campaign Creation Action
  createCampaign: async (campaignData, status = "active") => {
    set({ loading: true, error: null });
    try {
      // First create basic campaign via API
      const basicResult = await get().createBasicCampaign(campaignData);
      if (!basicResult.success) {
        throw new Error(basicResult.error);
      }

      const { accumulatedContacts } = get();

      // Add contacts if any exist
      if (accumulatedContacts.length > 0) {
        const validContacts = accumulatedContacts.filter(
          (contact) => contact.status === "valid"
        );
        if (validContacts.length > 0) {
          const manualContacts = validContacts.map((contact) => ({
            name: contact.name,
            phone: contact.phone,
          }));
          const contactsResult = await get().addManualContacts(manualContacts);
          if (!contactsResult.success) {
            console.warn("Failed to add contacts:", contactsResult.error);
          }
        }
      }

      // Show success toast
      console.log("🎯 Calling toast with status:", status);
      if (status === "draft") {
        campaignToaster.draft();
        console.log("📝 Draft toast called");
      } else {
        campaignToaster.success();
        console.log("✅ Success toast called");
      }

      // Add to campaigns array AND reload the list to ensure consistency
      set((state) => ({
        campaigns: [...state.campaigns, basicResult.campaign],
        showCreateCampaignModal: false,
        createCampaignStep: null,
        campaignFormData: null,
        stepHistory: [],
        contactMethod: null,
        accumulatedContacts: [],
        currentMethodContacts: [],
        isEditMode: false,
        editingCampaignId: null,
        editSource: null,
        loading: false,
      }));

      // Reload campaigns to ensure everything is synced
      await get().loadCampaigns({ page: 1 });

      return { success: true, campaign: basicResult.campaign };
    } catch (error) {
      const errorMessage = error.message || "Failed to create campaign";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Contacts APIs
  addManualContacts: async (contacts) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.addManualContacts(
        targetCampaignId,
        contacts
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to add contacts";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  getExistingContacts: async (options = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getExistingContacts(options);
      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load contacts";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  addExistingContactsByIds: async (contactIds) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.addExistingContactsByIds(
        targetCampaignId,
        contactIds
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to add contacts";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  uploadCSVContacts: async (file) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.uploadCSVContacts(
        targetCampaignId,
        file
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to upload contacts";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  getCampaignContacts: async (campaignId = null) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = campaignId || get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.getCampaignContacts(
        targetCampaignId
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign contacts";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  deleteCampaignContact: async (phone) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.deleteCampaignContact(
        targetCampaignId,
        phone
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to delete contact";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Phone Numbers APIs
  getAvailablePhones: async () => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getAvailablePhones();
      set({
        availablePhones: response.data.allUnique || [],
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load available phones";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  getCampaignSenders: async () => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.getCampaignSenders(
        targetCampaignId
      );
      const senderNumbers = response.data.senderNumbers || [];

      set({
        campaignSenders: senderNumbers,
        selectedPhoneNumbers: senderNumbers,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign senders";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  setCampaignSenders: async (senderNumbers) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.setCampaignSenders(
        targetCampaignId,
        senderNumbers
      );

      set({
        campaignSenders: senderNumbers,
        selectedPhoneNumbers: senderNumbers,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to set campaign senders";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  addCampaignSender: async (phone) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();
      const { campaignSenders } = get();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const updatedSenders = [...campaignSenders, phone];
      const response = await campaignService.setCampaignSenders(
        targetCampaignId,
        updatedSenders
      );

      set({
        campaignSenders: updatedSenders,
        selectedPhoneNumbers: updatedSenders,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to add sender";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  removeCampaignSender: async (phone) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();
      const { campaignSenders } = get();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const updatedSenders = campaignSenders.filter((p) => p !== phone);
      const response = await campaignService.removeCampaignSender(
        targetCampaignId,
        phone
      );

      set({
        campaignSenders: updatedSenders,
        selectedPhoneNumbers: updatedSenders,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to remove sender";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  scheduleCampaign: async (scheduleData) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.scheduleCampaign(
        targetCampaignId,
        scheduleData
      );

      set({
        campaignStartDate: new Date(scheduleData.startAt),
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to schedule campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Campaign List APIs
  loadCampaigns: async (options = {}) => {
    const state = get();
    const {
      page = 1,
      limit = 20,
      q = state.searchQuery,
      loadMore = false,
    } = options;

    set({ campaignsLoading: true, campaignsError: null });

    try {
      const response = await campaignService.listCampaigns({ page, limit, q });
      const { items, pagination } = response.data;

      set({
        campaigns: loadMore ? [...state.campaigns, ...items] : items,
        campaignsPagination: {
          ...pagination,
          hasMore: pagination.page < pagination.pages,
        },
        campaignsLoading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaigns";
      set({
        campaignsError: errorMessage,
        campaignsLoading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  searchCampaigns: async (query) => {
    set({ searchQuery: query });
    return await get().loadCampaigns({ page: 1, q: query });
  },

  loadMoreCampaigns: async () => {
    const state = get();
    const nextPage = state.campaignsPagination.page + 1;

    if (state.campaignsPagination.hasMore && !state.campaignsLoading) {
      return await get().loadCampaigns({
        page: nextPage,
        loadMore: true,
      });
    }
  },

  // Delete campaign with API call
  deleteCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      // Call the API to delete campaign
      const response = await campaignService.deleteCampaign(campaignId);

      if (response.success) {
        // Remove from local state immediately for smooth UI update
        set((state) => ({
          campaigns: state.campaigns.filter(
            (campaign) => campaign.id !== campaignId
          ),
          loading: false,
        }));

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to delete campaign");
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to delete campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update campaign basic details
  updateCampaign: async (campaignId, campaignData) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.updateCampaign(
        campaignId,
        campaignData
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to update campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update campaign status
  updateCampaignStatus: async (campaignId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.updateCampaignStatus(
        campaignId,
        status
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to update campaign status";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Options APIs
  getCampaignTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getCampaignTypes();
      set({
        campaignTypes: response.data || [],
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign types";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  getBusinessTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getBusinessTypes();
      set({
        businessTypes: response.data || [],
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load business types";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  getTones: async () => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getTones();
      set({
        toneOptions: response.data || [],
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load tone options";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Set campaign settings
  setCampaignSettings: async (settings) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.setCampaignSettings(
        targetCampaignId,
        settings
      );

      // Update local state with the settings
      if (settings.campaignType) {
        set({ campaignType: settings.campaignType });
      }
      if (settings.ecommerceType) {
        set({ ecommerceType: settings.ecommerceType });
      }
      if (settings.tone !== undefined) {
        set({ tone: settings.tone });
      }

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.message || "Failed to update campaign settings";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // AI Content Actions
  generateAICampaignDraft: async () => {
    set({ isGeneratingContent: true, error: null });
    try {
      const state = get();

      const draftData = {
        name: state.campaignFormData?.name || "New Campaign",
        description:
          state.campaignFormData?.description || "Campaign description",
        campaignType: state.campaignType || "",
        businessType: state.ecommerceType || "",
        tone: state.selectedTone || "balanced",
      };

      const response = await campaignService.generateAICampaignDraft(draftData);

      set({
        aiGeneratedContent: response.data,
        isGeneratingContent: false,
        // Auto-populate the business info and first message
        businessInfo:
          response.data.proposal?.businessNotes?.join("\n") ||
          state.businessInfo,
        firstMessage:
          response.data.proposal?.openerTemplate || state.firstMessage,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to generate AI content";
      set({
        error: errorMessage,
        isGeneratingContent: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  regenerateAIContent: () => {
    // Reset and go back to loading to regenerate
    const state = get();
    state.goToNextStep("loading");
  },

  // Save campaign summary (message body)
  saveCampaignSummary: async (messageBody) => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.saveCampaignSummary(
        targetCampaignId,
        messageBody
      );

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to save campaign summary";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Get campaign summary
  getCampaignSummary: async () => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found. Please create campaign first.");
      }

      const response = await campaignService.getCampaignSummary(
        targetCampaignId
      );

      set({
        campaignSummary: response.data,
        loading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign summary";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // ========== HELPER ACTIONS ==========

  togglePhoneNumber: async (phone) => {
    const { campaignSenders } = get();

    if (campaignSenders.includes(phone)) {
      return await get().removeCampaignSender(phone);
    } else {
      return await get().addCampaignSender(phone);
    }
  },

  selectAllAvailablePhones: async () => {
    const { availablePhones } = get();
    return await get().setCampaignSenders(availablePhones);
  },

  clearAllSelectedPhones: async () => {
    return await get().setCampaignSenders([]);
  },

  // ========== MODAL ACTIONS ==========

  openCreateCampaignModal: () =>
    set({
      showCreateCampaignModal: true,
      createCampaignStep: "setup",
      campaignFormData: {},
      stepHistory: ["setup"],
      contactMethod: null,
      accumulatedContacts: [],
      currentMethodContacts: [],
      // Reset Ciara data
      campaignType: "",
      ecommerceType: "",
      tone: 0.5,
      businessInfo:
        "We sell affordable, high-quality fashion basics.\nIf customer hesitates, remind them about our 30-day return policy.\nTone: friendly, casual, supportive.",
      firstMessage:
        "Hey {{FirstName}}, noticed you left something in your cart 👀 Want me to save it for you?",
      customCampaignIdea: "",
      // Reset edit mode
      isEditMode: false,
      editingCampaignId: null,
      editSource: null,
      // Reset scheduling data
      selectedPhoneNumbers: [],
      campaignStartDate: null,
      dailySendingCapacity: 100,
      estimatedCompletion: null,
      // Reset API state
      currentCampaignId: null,
      availablePhones: [],
      campaignSenders: [],
    }),

  openEditCampaignModal: async (campaignId) => {
    const state = get();
    const campaign = state.campaigns.find((c) => c.id === campaignId);

    if (campaign) {
      set({
        showCreateCampaignModal: true,
        createCampaignStep: "setup",
        isEditMode: true,
        editingCampaignId: campaignId,
        stepHistory: ["setup"],
        // Pre-fill with campaign data
        campaignFormData: {
          name: campaign.name,
          description: campaign.description,
        },
        campaignType: campaign.campaignType || "",
        ecommerceType: campaign.ecommerceType || "",
        tone: campaign.tone || 0.5,
        businessInfo:
          campaign.businessInfo ||
          "We sell affordable, high-quality fashion basics.\nIf customer hesitates, remind them about our 30-day return policy.\nTone: friendly, casual, supportive.",
        firstMessage:
          campaign.firstMessage ||
          "Hey {{FirstName}}, noticed you left something in your cart 👀 Want me to save it for you?",
        customCampaignIdea: campaign.customCampaignIdea || "",
        // Pre-fill contacts for edit mode
        accumulatedContacts: campaign.contactsList || [],
        contactMethod: null,
        currentMethodContacts: [],
        // Pre-fill scheduling data for edit mode
        selectedPhoneNumbers: campaign.selectedPhoneNumbers || [],
        campaignStartDate: campaign.campaignStartDate || null,
        dailySendingCapacity: campaign.dailySendingCapacity || 100,
        estimatedCompletion: campaign.estimatedCompletion || null,
        editSource: null,
      });

      // Fetch settings in background
      try {
        const settingsResult = await get().getCampaignSettings();
        if (settingsResult.success) {
          console.log("Settings loaded for edit:", settingsResult.data);
        }
      } catch (error) {
        console.error("Failed to load campaign settings:", error);
      }
    }
  },

  closeCreateCampaignModal: () =>
    set({
      showCreateCampaignModal: false,
      createCampaignStep: null,
      campaignFormData: null,
      stepHistory: [],
      contactMethod: null,
      accumulatedContacts: [],
      currentMethodContacts: [],
      isEditMode: false,
      editingCampaignId: null,
      editSource: null,
      currentCampaignId: null,
      availablePhones: [],
      campaignSenders: [],
    }),

  goToNextStep: (step) =>
    set((state) => ({
      createCampaignStep: step,
      stepHistory: [...state.stepHistory, step],
    })),

  goToPreviousStep: () =>
    set((state) => {
      if (state.stepHistory.length <= 1) {
        return {
          createCampaignStep: "setup",
          stepHistory: ["setup"],
        };
      }

      const newHistory = [...state.stepHistory];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];

      return {
        createCampaignStep: previousStep,
        stepHistory: newHistory,
      };
    }),

  updateFormData: (data) =>
    set((state) => ({
      campaignFormData: { ...state.campaignFormData, ...data },
    })),

  // Edit source tracking
  setEditSource: (source) => set({ editSource: source }),

  // Contact Flow Actions
  setContactMethod: (method) => set({ contactMethod: method }),

  setCurrentMethodContacts: (contacts) =>
    set({ currentMethodContacts: contacts }),

  addToAccumulatedContacts: (contacts) =>
    set((state) => {
      const newContacts = contacts.filter(
        (newContact) =>
          !state.accumulatedContacts.some(
            (existingContact) =>
              existingContact.phone === newContact.phone &&
              existingContact.name === newContact.name
          )
      );

      return {
        accumulatedContacts: [...state.accumulatedContacts, ...newContacts],
      };
    }),

  updateAccumulatedContacts: (contacts) =>
    set({ accumulatedContacts: contacts }),

  resetContactFlow: () =>
    set({
      contactMethod: null,
      currentMethodContacts: [],
      accumulatedContacts: [],
    }),

  // Ciara Agent Setup Actions
  setCampaignType: (type) => set({ campaignType: type }),

  setEcommerceType: (type) => set({ ecommerceType: type }),

  setTone: (toneValue) => set({ tone: toneValue }),

  setBusinessInfo: (info) => set({ businessInfo: info }),

  setFirstMessage: (message) => set({ firstMessage: message }),

  setCustomCampaignIdea: (idea) => set({ customCampaignIdea: idea }),

  // Scheduling Actions
  setSelectedPhoneNumbers: async (numbers) => {
    const result = await get().setCampaignSenders(numbers);
    if (result.success) {
      set({ selectedPhoneNumbers: numbers });
    }
    return result;
  },

  setCampaignStartDate: (date) => set({ campaignStartDate: date }),

  setDailySendingCapacity: (capacity) =>
    set({ dailySendingCapacity: capacity }),

  setEstimatedCompletion: (date) => set({ estimatedCompletion: date }),

  // Navigation action
  navigateToEditStep: (step) =>
    set((state) => ({
      createCampaignStep: step,
      stepHistory: [...state.stepHistory, step],
    })),

  // In your useCampaignStore, add this action:
  getCampaignSettings: async () => {
    set({ loading: true, error: null });
    try {
      const targetCampaignId = get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found.");
      }

      const response = await campaignService.getCampaignSettings(
        targetCampaignId
      );

      // Update local state with the fetched settings
      const settings = response.data;
      if (settings) {
        set({
          campaignType: settings.campaignType || "",
          ecommerceType: settings.ecommerceType || "",
          tone: settings.tone || 0.5,
          loading: false,
        });
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign settings";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // In your useCampaignStore, add these actions:

  // Start campaign
  startCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.startCampaign(campaignId);

      // Update local state if the campaign is in the list
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, status: "active" }
            : campaign
        ),
        loading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to start campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Pause campaign
  pauseCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.pauseCampaign(campaignId);

      // Update local state if the campaign is in the list
      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, status: "inactive" }
            : campaign
        ),
        loading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to pause campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // can keep the old updateCampaignStatus for other status changes if needed
  // or remove it if you're only using start/pause
  // In your useCampaignStore, add this action:

  // Get campaign analytics
  getCampaignAnalytics: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getCampaignAnalytics(campaignId);

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign analytics";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Add to your store state
  dailyStatus: null,
  dailyStatusLoading: false,

  // Add these API actions:
  getCampaignDailyStatus: async (campaignId = null) => {
    set({ dailyStatusLoading: true, error: null });
    try {
      const targetCampaignId = campaignId || get().getTargetCampaignId();

      if (!targetCampaignId) {
        throw new Error("No campaign ID found.");
      }

      const response = await campaignService.getCampaignDailyStatus(
        targetCampaignId
      );

      set({
        dailyStatus: response.data,
        dailyStatusLoading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load daily status";
      set({
        error: errorMessage,
        dailyStatusLoading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Helper to refresh daily status when phones change
  refreshDailyStatus: async () => {
    const targetCampaignId = get().getTargetCampaignId();
    if (targetCampaignId) {
      await get().getCampaignDailyStatus(targetCampaignId);
    }
  },

  // In useCampaignStore
  getCampaignById: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      const response = await campaignService.getCampaignById(campaignId);
      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to load campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useCampaignStore;
