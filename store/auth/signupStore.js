import { create } from "zustand";

const useSignupStore = create((set, get) => ({
  // Current step
  currentStep: 1,
  totalSteps: 4,
  
  // Step 1: Email & Google Auth
  email: "",
  googleAuthUsed: false,
  
  // Step 2: Workspace Creation
  companyLogo: null,
  companyName: "",
  workspaceHandle: "",
  billingCountry: "United States of America",
  
  // Step 3: Team Members
  teamMembers: [],
  
  // Step 4: How did you hear about us
  referralSource: "",
  
  // Form states
  isLoading: false,
  errors: {},
  
  // Actions
  setCurrentStep: (step) => {
    set({ currentStep: step });
  },
  
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  // Step 1 actions
  setEmail: (email) => {
    set({ email });
  },
  
  setGoogleAuthUsed: (used) => {
    set({ googleAuthUsed: used });
  },
  
  // Step 2 actions
  setCompanyLogo: (logo) => {
    set({ companyLogo: logo });
  },
  
  setCompanyName: (name) => {
    set({ companyName: name });
  },
  
  setWorkspaceHandle: (handle) => {
    set({ workspaceHandle: handle });
  },
  
  setBillingCountry: (country) => {
    set({ billingCountry: country });
  },
  
  // Step 3 actions
  addTeamMember: (member) => {
    set((state) => ({
      teamMembers: [...state.teamMembers, { ...member, id: Date.now() }]
    }));
  },
  
  removeTeamMember: (id) => {
    set((state) => ({
      teamMembers: state.teamMembers.filter(member => member.id !== id)
    }));
  },
  
  updateTeamMember: (id, updates) => {
    set((state) => ({
      teamMembers: state.teamMembers.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    }));
  },
  
  // Step 4 actions
  setReferralSource: (source) => {
    set({ referralSource: source });
  },
  
  // Form actions
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setErrors: (errors) => {
    set({ errors });
  },
  
  clearErrors: () => {
    set({ errors: {} });
  },
  
  // Validation
  validateStep: (step) => {
    const state = get();
    const errors = {};
    
    switch (step) {
      case 1:
        if (!state.email && !state.googleAuthUsed) {
          errors.email = "Email is required";
        } else if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
          errors.email = "Please enter a valid email address";
        }
        break;
        
      case 2:
        if (!state.companyName.trim()) {
          errors.companyName = "Company name is required";
        }
        if (!state.workspaceHandle.trim()) {
          errors.workspaceHandle = "Workspace handle is required";
        }
        if (!state.billingCountry) {
          errors.billingCountry = "Billing country is required";
        }
        break;
        
      case 3:
        // Team members are optional, no validation needed
        break;
        
      case 4:
        // Referral source is optional, no validation needed
        break;
        
      default:
        break;
    }
    
    set({ errors });
    return Object.keys(errors).length === 0;
  },
  
  // API simulation
  submitStep: async (step) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Validate step
      const isValid = get().validateStep(step);
      
      if (isValid) {
        get().nextStep();
      }
      
      return isValid;
    } catch (error) {
      console.error("Step submission failed:", error);
      set({ errors: { general: "Something went wrong. Please try again." } });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Reset store
  reset: () => {
    set({
      currentStep: 1,
      email: "",
      googleAuthUsed: false,
      companyLogo: null,
      companyName: "",
      workspaceHandle: "",
      billingCountry: "United States of America",
      teamMembers: [],
      referralSource: "",
      isLoading: false,
      errors: {},
    });
  },
}));

export default useSignupStore;
