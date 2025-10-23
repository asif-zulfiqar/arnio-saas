import { create } from "zustand";
import { faqService } from "@/lib/api/faq";
import toast from "react-hot-toast";

// Single source of truth for workspace ID
const WORKSPACE_ID = "arnio-ws-1";

const useFaqStore = create((set, get) => ({
  // State
  faqs: [],
  loading: false,
  error: null,

  showAddFaqModal: false,
  showEditFaqModal: false,
  showDeleteFaqModal: false,
  selectedFaq: null,
  searchQuery: "",

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleAddFaqModal: () =>
    set((state) => ({ showAddFaqModal: !state.showAddFaqModal })),

  toggleEditFaqModal: () =>
    set((state) => ({ showEditFaqModal: !state.showEditFaqModal })),

  toggleDeleteFaqModal: () =>
    set((state) => ({ showDeleteFaqModal: !state.showDeleteFaqModal })),

  setSelectedFaq: (faq) => set({ selectedFaq: faq }),

  // Load FAQs from API
  loadFaqs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await faqService.getFaqs(WORKSPACE_ID);
      set({
        faqs: response.data || [],
        loading: false,
      });
    } catch (error) {
      const errorMessage = error.message || "Failed to load FAQs";
      set({
        error: errorMessage,
        loading: false,
        faqs: [],
      });
      toast.error(errorMessage);
    }
  },

  // Add FAQ via API
  addFaq: async (faqData) => {
    set({ loading: true, error: null });
    try {
      const response = await faqService.createFaq(WORKSPACE_ID, faqData);
      const newFaq = response.data;

      set((state) => ({
        faqs: [...state.faqs, newFaq],
        loading: false,
      }));

      toast.success("FAQ added successfully!");
      return { success: true, faq: newFaq };
    } catch (error) {
      const errorMessage = error.message || "Failed to add FAQ";
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Update FAQ via API
  updateFaq: async (faqId, updatedFaq) => {
    set({ loading: true, error: null });
    try {
      const response = await faqService.updateFaq(
        WORKSPACE_ID,
        faqId,
        updatedFaq
      );
      const updatedFaqData = response.data;

      set((state) => ({
        faqs: state.faqs.map((faq) =>
          faq.id === faqId ? { ...faq, ...updatedFaqData } : faq
        ),
        loading: false,
      }));

      toast.success("FAQ updated successfully!");
      return { success: true, faq: updatedFaqData };
    } catch (error) {
      const errorMessage = error.message || "Failed to update FAQ";
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Delete FAQ via API
  deleteFaq: async (faqId) => {
    set({ loading: true, error: null });
    try {
      await faqService.deleteFaq(WORKSPACE_ID, faqId);

      set((state) => ({
        faqs: state.faqs.filter((faq) => faq.id !== faqId),
        loading: false,
      }));

      toast.success("FAQ deleted successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || "Failed to delete FAQ";
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Filter FAQs locally (client-side search)
  getFilteredFaqs: () => {
    const { faqs, searchQuery } = get();
    if (!searchQuery) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  // Initialize data on store creation
  initialize: () => {
    get().loadFaqs();
  },
}));

// Initialize the store
useFaqStore.getState().initialize();

export default useFaqStore;
