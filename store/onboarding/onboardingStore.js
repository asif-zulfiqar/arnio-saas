import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from '@/store/auth/authStore';

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Onboarding state
      isOnboardingActive: false,
      currentStep: 1,
      totalSteps: 5,
      isCompleted: false,
      hasBeenShown: false,
      hasSeenWelcomeScreen: false,

      // Onboarding steps configuration
      steps: [
        {
          id: 1,
          title: "Campaign",
          description: "Build a simple follow-up sequence you can turn on when your line is live.",
          targetElement: "campaigns-icon",
          position: "left",
          showArrow: true,
        },
        {
          id: 2,
          title: "Settings",
          description: "Review plan, team roles, and integrations.",
          targetElement: "settings-icon",
          position: "left",
          showArrow: true,
        },
        {
          id: 3,
          title: "Analytics",
          description: "See the key metrics we'll track: reply rate, show-ups, response speed.",
          targetElement: "analytics-icon",
          position: "left",
          showArrow: true,
        },
        {
          id: 4,
          title: "Help and first steps",
          description: "You can review again this tips whenever you need.",
          targetElement: "help-icon",
          position: "left",
          showArrow: true,
        },
        {
          id: 5,
          title: "Add Team Members",
          description: "You can add team members here.",
          targetElement: "settings-icon",
          position: "left",
          showArrow: true,
          isPro: true,
        },
      ],

      // Actions
      startOnboarding: () => {
        set({
          isOnboardingActive: true,
          currentStep: 1,
          isCompleted: false,
        });
      },

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        } else {
          set({ isCompleted: true, isOnboardingActive: false });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      skipOnboarding: () => {
        set({
          isOnboardingActive: false,
          isCompleted: true,
          hasBeenShown: true,
        });
      },

      closeOnboarding: () => {
        set({
          isOnboardingActive: false,
          hasBeenShown: true,
        });
      },

      markWelcomeScreenAsSeen: () => {
        set({
          hasSeenWelcomeScreen: true,
        });
      },

      resetOnboarding: () => {
        set({
          isOnboardingActive: false,
          currentStep: 1,
          isCompleted: false,
          hasBeenShown: false,
          hasSeenWelcomeScreen: false,
        });
      },

      getCurrentStep: () => {
        const { steps, currentStep } = get();
        return steps.find(step => step.id === currentStep);
      },

      shouldShowOnboarding: () => {
        const { isOnboardingActive } = get();
        const { user } = useAuthStore.getState();
        
        // If onboarding is actively started, show it regardless of onboarded status
        if (isOnboardingActive) {
          return true;
        }
        
        // If user is not onboarded, show onboarding popups
        if (user && !user.isOnboarded) {
          return true; // User needs onboarding popups
        }
        
        // Fallback: don't show onboarding if no user data
        return false;
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        hasBeenShown: state.hasBeenShown,
        isCompleted: state.isCompleted,
        hasSeenWelcomeScreen: state.hasSeenWelcomeScreen,
      }),
    }
  )
);

export default useOnboardingStore;
