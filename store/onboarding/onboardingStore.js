"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Onboarding state
      isOnboardingActive: false,
      currentStep: 0,
      isCompleted: false,
      hasBeenShown: false,

      // Onboarding steps configuration
      steps: [
        {
          id: "campaign",
          title: "Campaign",
          description: "Build a simple follow-up sequence you can turn on when your line is live.",
          targetSelector: null, // Will be set when integrating with specific components
          position: "center",
          showProBadge: false,
        },
        {
          id: "settings",
          title: "Settings",
          description: "Review plan, team roles, and integrations.",
          targetSelector: null,
          position: "center",
          showProBadge: false,
        },
        {
          id: "analytics",
          title: "Analytics",
          description: "See the key metrics we'll track: reply rate, show-ups, response speed.",
          targetSelector: null,
          position: "center",
          showProBadge: false,
        },
        {
          id: "help",
          title: "Help and first steps",
          description: "You can review again this tips whenever you need.",
          targetSelector: null,
          position: "center",
          showProBadge: false,
        },
        {
          id: "team-members",
          title: "Add Team Members",
          description: "You can add team members here.",
          targetSelector: null,
          position: "center",
          showProBadge: true,
        },
      ],

      // Actions
      startOnboarding: () => {
        set({
          isOnboardingActive: true,
          currentStep: 0,
          hasBeenShown: true,
        });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          get().completeOnboarding();
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      skipOnboarding: () => {
        set({
          isOnboardingActive: false,
          isCompleted: true,
        });
      },

      completeOnboarding: () => {
        set({
          isOnboardingActive: false,
          isCompleted: true,
        });
      },

      resetOnboarding: () => {
        set({
          isOnboardingActive: false,
          currentStep: 0,
          isCompleted: false,
          hasBeenShown: false,
        });
      },

      // Get current step data
      getCurrentStep: () => {
        const { currentStep, steps } = get();
        return steps[currentStep];
      },

      // Check if onboarding should be shown
      shouldShowOnboarding: () => {
        const { hasBeenShown, isCompleted } = get();
        return !hasBeenShown && !isCompleted;
      },
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        isCompleted: state.isCompleted,
        hasBeenShown: state.hasBeenShown,
      }),
    }
  )
);

export default useOnboardingStore;
