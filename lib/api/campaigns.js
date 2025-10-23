import api from "./api";

// Campaign service functions
export const campaignService = {
  // Create basic campaign
  createBasicCampaign: async (campaignData) => {
    try {
      const response = await api.post("/ai/campaigns/basic", campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add manual contacts to campaign
  addManualContacts: async (campaignId, contacts) => {
    try {
      const response = await api.post(
        `/ai/campaigns/${campaignId}/contacts/manual`,
        {
          contacts: contacts.map((contact) => ({
            name: contact.name,
            phone: contact.phone,
          })),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get existing contacts
  getExistingContacts: async (options = {}) => {
    try {
      const { page = 1, limit = 50, q = "" } = options;
      const params = { page, limit };
      if (q) params.q = q;

      const response = await api.get("/ai/contacts", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add selected existing contacts by IDs
  addExistingContactsByIds: async (campaignId, contactIds) => {
    try {
      const response = await api.post(
        `/ai/campaigns/${campaignId}/contacts/by-ids`,
        {
          contactIds,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload CSV contacts
  uploadCSVContacts: async (campaignId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/ai/campaigns/${campaignId}/contacts/upload-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campaign contacts
  getCampaignContacts: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/contacts`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete campaign contact
  deleteCampaignContact: async (campaignId, phone) => {
    try {
      const response = await api.delete(
        `/ai/campaigns/${campaignId}/contacts/${phone}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Phone Numbers APIs
  getAvailablePhones: async () => {
    try {
      const response = await api.get("/ai/phones/available");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCampaignSenders: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/senders`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  setCampaignSenders: async (campaignId, senderNumbers) => {
    try {
      const response = await api.post(`/ai/campaigns/${campaignId}/senders`, {
        senderNumbers,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeCampaignSender: async (campaignId, phone) => {
    try {
      const response = await api.delete(
        `/ai/campaigns/${campaignId}/senders/${phone}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Schedule campaign
  scheduleCampaign: async (campaignId, scheduleData) => {
    try {
      const response = await api.post(
        `/ai/campaigns/${campaignId}/schedule`,
        scheduleData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campaign types
  getCampaignTypes: async () => {
    try {
      const response = await api.get("/ai/campaigns/types");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get business types
  getBusinessTypes: async () => {
    try {
      const response = await api.get("/ai/campaigns/business-types");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available tone options
  getTones: async () => {
    try {
      const response = await api.get("/ai/campaigns/tones");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Set campaign settings
  setCampaignSettings: async (campaignId, settings) => {
    try {
      const response = await api.post(
        `/ai/campaigns/${campaignId}/settings`,
        settings
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In your campaignService object, add this method:
  getCampaignSettings: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/settings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Generate AI campaign draft
  generateAICampaignDraft: async (draftData) => {
    try {
      const response = await api.post(
        "/ai/campaigns/draft/generate",
        draftData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save campaign summary (message body)
  saveCampaignSummary: async (campaignId, messageBody) => {
    try {
      const response = await api.post(`/ai/campaigns/${campaignId}/summary`, {
        messageBody,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campaign summary
  getCampaignSummary: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/summary`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // List campaigns with pagination and search
  listCampaigns: async (options = {}) => {
    try {
      const { page = 1, limit = 20, q = "" } = options;
      const params = { page, limit };
      if (q) params.q = q;

      const response = await api.get("/ai/campaigns", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/ai/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update campaign basic details
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.patch(
        `/ai/campaigns/${campaignId}`,
        campaignData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update campaign status
  updateCampaignStatus: async (campaignId, status) => {
    try {
      const response = await api.patch(`/ai/campaigns/${campaignId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Start campaign immediately
  startCampaign: async (campaignId) => {
    try {
      const response = await api.post(`/ai/campaigns/${campaignId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Pause campaign
  pauseCampaign: async (campaignId) => {
    try {
      const response = await api.post(`/ai/campaigns/${campaignId}/pause`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Keep the existing status check if needed
  getCampaignStatus: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campaign analytics
  getCampaignAnalytics: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In your campaignService object, add:
  getCampaignDailyStatus: async (campaignId) => {
    try {
      const response = await api.get(
        `/ai/campaigns/${campaignId}/daily-status`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In campaignService object
  getCampaignById: async (campaignId) => {
    try {
      const response = await api.get(`/ai/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
