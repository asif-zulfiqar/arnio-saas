import api from "./api";

// FAQ service functions
export const faqService = {
  // Get all FAQs for a workspace
  getFaqs: async (workspaceId, options = {}) => {
    try {
      const { page = 1, limit = 50 } = options;
      const params = { page, limit };

      const response = await api.get(`/faq/${workspaceId}/faqs`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new FAQ
  createFaq: async (workspaceId, faqData) => {
    try {
      const response = await api.post(`/faq/${workspaceId}/faqs`, faqData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update an existing FAQ
  updateFaq: async (workspaceId, faqId, faqData) => {
    try {
      const response = await api.patch(
        `/faq/${workspaceId}/faqs/${faqId}`,
        faqData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an FAQ
  deleteFaq: async (workspaceId, faqId) => {
    try {
      const response = await api.delete(`/faq/${workspaceId}/faqs/${faqId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
