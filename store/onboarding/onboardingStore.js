import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Onboarding state
      isOnboardingActive: false,
      currentStep: 1,
      totalSteps: 5,
      isCompleted: false,
      hasBeenShown: false,

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

      resetOnboarding: () => {
        set({
          isOnboardingActive: false,
          currentStep: 1,
          isCompleted: false,
          hasBeenShown: false,
        });
      },

      getCurrentStep: () => {
        const { steps, currentStep } = get();
        return steps.find(step => step.id === currentStep);
      },

      shouldShowOnboarding: () => {
        const { hasBeenShown, isCompleted } = get();
        return !hasBeenShown && !isCompleted;
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        hasBeenShown: state.hasBeenShown,
        isCompleted: state.isCompleted,
      }),
    }
  )
);

export default useOnboardingStore;
