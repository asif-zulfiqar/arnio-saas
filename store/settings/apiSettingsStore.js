import { create } from "zustand";

const useApiSettingsStore = create((set, get) => ({
  // API Keys State
  apiKeys: [],

  // Webhooks State
  webhooks: [],

  // Modal States
  showAddApiKeyModal: false,
  showEditApiKeyModal: false,
  showApiKeySuccessModal: false,
  showDeleteApiKeyModal: false,
  showAddWebhookModal: false,
  showEditWebhookModal: false,
  showDeleteWebhookModal: false,

  // Selected Items
  selectedApiKey: null,
  selectedWebhook: null,
  newApiKey: null,

  // Loading States
  isLoading: false,
  hasApiKeys: false,
  hasWebhooks: false,

  // Form Data
  apiKeyForm: {
    name: "",
    expirationDate: "30 days",
    neverExpires: false,
  },

  webhookForm: {
    name: "",
    targetUrl: "",
  },

  // Actions for API Keys
  loadApiKeys: async () => {
    set({ isLoading: true });

    // Simulate API call
    setTimeout(() => {
      // Start with empty state, then populate with example data when user adds
      set({
        apiKeys: [],
        hasApiKeys: false,
        isLoading: false,
      });
    }, 500);
  },

  loadWebhooks: async () => {
    set({ isLoading: true });

    // Simulate API call
    setTimeout(() => {
      // Start with empty state
      set({
        webhooks: [],
        hasWebhooks: false,
        isLoading: false,
      });
    }, 500);
  },

  toggleAddApiKeyModal: () => {
    set((state) => ({
      showAddApiKeyModal: !state.showAddApiKeyModal,
      apiKeyForm: {
        name: "",
        expirationDate: "30 days",
        neverExpires: false,
      },
    }));
  },

  toggleEditApiKeyModal: (apiKey = null) => {
    set((state) => ({
      showEditApiKeyModal: !state.showEditApiKeyModal,
      selectedApiKey: apiKey,
      apiKeyForm: apiKey
        ? {
            name: apiKey.name,
            expirationDate: apiKey.expirationDate,
            neverExpires: apiKey.neverExpires,
          }
        : {
            name: "",
            expirationDate: "30 days",
            neverExpires: false,
          },
    }));
  },

  toggleApiKeySuccessModal: (apiKey = null) => {
    set((state) => ({
      showApiKeySuccessModal: !state.showApiKeySuccessModal,
      newApiKey: apiKey,
    }));
  },

  toggleDeleteApiKeyModal: (apiKey = null) => {
    set({
      showDeleteApiKeyModal: !get().showDeleteApiKeyModal,
      selectedApiKey: apiKey,
    });
  },

  toggleAddWebhookModal: () => {
    set((state) => ({
      showAddWebhookModal: !state.showAddWebhookModal,
      webhookForm: {
        name: "",
        targetUrl: "",
      },
    }));
  },

  toggleEditWebhookModal: (webhook = null) => {
    set((state) => ({
      showEditWebhookModal: !state.showEditWebhookModal,
      selectedWebhook: webhook,
      webhookForm: webhook
        ? {
            name: webhook.name,
            targetUrl: webhook.targetUrl,
          }
        : {
            name: "",
            targetUrl: "",
          },
    }));
  },

  toggleDeleteWebhookModal: (webhook = null) => {
    set({
      showDeleteWebhookModal: !get().showDeleteWebhookModal,
      selectedWebhook: webhook,
    });
  },

  updateApiKeyForm: (field, value) => {
    set((state) => ({
      apiKeyForm: {
        ...state.apiKeyForm,
        [field]: value,
      },
    }));
  },

  updateWebhookForm: (field, value) => {
    set((state) => ({
      webhookForm: {
        ...state.webhookForm,
        [field]: value,
      },
    }));
  },

  createApiKey: () => {
    const { apiKeyForm } = get();
    const expirationDate = apiKeyForm.neverExpires
      ? null
      : new Date(
          Date.now() +
            getExpirationDays(apiKeyForm.expirationDate) * 24 * 60 * 60 * 1000
        );

    const newKey = {
      id: Date.now(),
      name: apiKeyForm.name || "API Key",
      key: `https://flowbite.com/docs/components/alerts/`,
      expirationDate: expirationDate
        ? expirationDate.toLocaleDateString()
        : "Never expires",
      createdAt: new Date().toLocaleDateString(),
      status: "active",
    };

    set((state) => ({
      apiKeys: [...state.apiKeys, newKey],
      hasApiKeys: true,
      showAddApiKeyModal: false,
      showApiKeySuccessModal: true,
      newApiKey: newKey,
    }));
  },

  updateApiKey: () => {
    const { selectedApiKey, apiKeyForm } = get();
    if (!selectedApiKey) return;

    set((state) => ({
      apiKeys: state.apiKeys.map((key) =>
        key.id === selectedApiKey.id ? { ...key, name: apiKeyForm.name } : key
      ),
      showEditApiKeyModal: false,
      selectedApiKey: null,
    }));
  },

  deleteApiKey: () => {
    const { selectedApiKey } = get();
    if (!selectedApiKey) return;

    set((state) => ({
      apiKeys: state.apiKeys.filter((key) => key.id !== selectedApiKey.id),
      hasApiKeys: state.apiKeys.length > 1,
      showDeleteApiKeyModal: false,
      selectedApiKey: null,
    }));
  },

  createWebhook: () => {
    const { webhookForm } = get();

    const newWebhook = {
      id: Date.now(),
      name: webhookForm.name || "Webhook",
      targetUrl: webhookForm.targetUrl,
      createdAt: new Date().toLocaleDateString(),
      status: "active",
      icon: webhookForm.name.toLowerCase().includes("shopify")
        ? "shopify"
        : "default",
    };

    set((state) => ({
      webhooks: [...state.webhooks, newWebhook],
      hasWebhooks: true,
      showAddWebhookModal: false,
    }));
  },

  updateWebhook: () => {
    const { selectedWebhook, webhookForm } = get();
    if (!selectedWebhook) return;

    set((state) => ({
      webhooks: state.webhooks.map((webhook) =>
        webhook.id === selectedWebhook.id
          ? { ...webhook, ...webhookForm }
          : webhook
      ),
      showEditWebhookModal: false,
      selectedWebhook: null,
    }));
  },

  deleteWebhook: () => {
    const { selectedWebhook } = get();
    if (!selectedWebhook) return;

    set((state) => ({
      webhooks: state.webhooks.filter(
        (webhook) => webhook.id !== selectedWebhook.id
      ),
      hasWebhooks: state.webhooks.length > 1,
      showDeleteWebhookModal: false,
      selectedWebhook: null,
    }));
  },
}));

// Helper function
const getExpirationDays = (period) => {
  switch (period) {
    case "7 days":
      return 7;
    case "30 days":
      return 30;
    case "3 months":
      return 90;
    case "1 year":
      return 365;
    default:
      return 30;
  }
};

export default useApiSettingsStore;
