import { create } from "zustand";

const useAccountStore = create((set, get) => ({
  // Account Details
  profilePicture: null,
  fullName: "Bonnie Green",
  email: "name@flowbite.com",
  userRole: "Admin",
  phoneNumber: "e.g. +(12)3456 789",

  // Phone Lines
  phoneLines: [
    {
      id: 1,
      number: "+1 567 465 4134",
      status: "Activating...",
      activatedDate: null,
      limit: null,
    },
    {
      id: 2,
      number: "+1 567 465 4134",
      status: "Activated",
      activatedDate: "30 Aug 2024",
      limit: 50,
    },
    {
      id: 3,
      number: "+1 567 465 4134",
      status: "Activated",
      activatedDate: "30 Aug 2024",
      limit: 50,
    },
  ],

  // Plan Details
  planName: "Plan Name Pro",
  planStartDate: "25 Jan 2025",
  contactsUsed: 68,
  contactsTotal: 100,
  creditsUsed: 26,
  creditsTotal: 100,

  // Workspace Details
  companyLogo: null,
  companyName: "Meadowfield",
  billingCountry: "United States of America",
  workspaceHandle: "dashboard.amio.co/my-workspace",

  // Password
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

  // Modal States
  showDeletePhoneModal: false,
  showSaveChangesModal: false,
  showUnsavedChangesModal: false,
  phoneToDelete: null,
  pendingChanges: {},
  saveTarget: null, // Which section is being saved

  // Form States
  hasUnsavedChanges: false,
  isLoading: false,
  errors: {},

  // Actions
  setProfilePicture: (file) => {
    set({
      profilePicture: file,
      hasUnsavedChanges: true,
    });
  },

  removeProfilePicture: () => {
    set({
      profilePicture: null,
      hasUnsavedChanges: true,
    });
  },

  updateAccountDetails: (field, value) => {
    set((state) => ({
      [field]: value,
      hasUnsavedChanges: true,
      pendingChanges: {
        ...state.pendingChanges,
        accountDetails: {
          ...state.pendingChanges.accountDetails,
          [field]: value,
        },
      },
    }));
  },

  updateWorkspaceDetails: (field, value) => {
    set((state) => ({
      [field]: value,
      hasUnsavedChanges: true,
      pendingChanges: {
        ...state.pendingChanges,
        workspaceDetails: {
          ...state.pendingChanges.workspaceDetails,
          [field]: value,
        },
      },
    }));
  },

  updatePassword: (field, value) => {
    set((state) => ({
      [field]: value,
      pendingChanges: {
        ...state.pendingChanges,
        password: {
          ...state.pendingChanges.password,
          [field]: value,
        },
      },
    }));
  },

  addPhoneLine: () => {
    set((state) => ({
      phoneLines: [
        ...state.phoneLines,
        {
          id: Date.now(),
          number: "+1 XXX XXX XXXX",
          status: "Pending",
          activatedDate: null,
          limit: null,
        },
      ],
    }));
  },

  toggleDeletePhoneModal: (phone = null) => {
    set({
      showDeletePhoneModal: !get().showDeletePhoneModal,
      phoneToDelete: phone,
    });
  },

  deletePhoneLine: () => {
    const { phoneToDelete } = get();
    if (phoneToDelete) {
      set((state) => ({
        phoneLines: state.phoneLines.filter((p) => p.id !== phoneToDelete.id),
        showDeletePhoneModal: false,
        phoneToDelete: null,
      }));
    }
  },

  toggleSaveChangesModal: (section = null) => {
    set({
      showSaveChangesModal: !get().showSaveChangesModal,
      saveTarget: section,
    });
  },

  toggleUnsavedChangesModal: () => {
    set({
      showUnsavedChangesModal: !get().showUnsavedChangesModal,
    });
  },

  saveChanges: async (section) => {
    set({ isLoading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Clear pending changes for this section
    set((state) => {
      const newPendingChanges = { ...state.pendingChanges };
      delete newPendingChanges[section];

      return {
        isLoading: false,
        hasUnsavedChanges: Object.keys(newPendingChanges).length > 0,
        pendingChanges: newPendingChanges,
        showSaveChangesModal: false,
        saveTarget: null,
      };
    });
  },

  discardChanges: (section) => {
    set((state) => {
      const newPendingChanges = { ...state.pendingChanges };
      delete newPendingChanges[section];

      return {
        hasUnsavedChanges: Object.keys(newPendingChanges).length > 0,
        pendingChanges: newPendingChanges,
        showUnsavedChangesModal: false,
      };
    });
  },

  validatePassword: () => {
    const { currentPassword, newPassword, confirmPassword } = get();
    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else {
      if (newPassword.length < 10) {
        errors.newPassword = "At least 10 characters";
      }
      if (!/[a-z]/.test(newPassword)) {
        errors.newPassword = "At least one lowercase character";
      }
      if (
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword) ||
        !/[!@#$%^&*]/.test(newPassword)
      ) {
        errors.newPassword =
          "Include at least one special character, e.g., ! @ # ?";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  upgradePlan: () => {
    // Handle plan upgrade
    console.log("Upgrading plan...");
  },
}));

export default useAccountStore;
