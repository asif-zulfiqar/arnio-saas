"use client";
import { useEffect } from "react";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

/**
 * Custom hook for managing onboarding state and actions
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoStart - Whether to automatically start onboarding
 * @param {number} options.delay - Delay in milliseconds before auto-starting
 * @param {Function} options.onComplete - Callback when onboarding is completed
 * @param {Function} options.onSkip - Callback when onboarding is skipped
 * @returns {Object} Onboarding state and actions
 */
export const useOnboarding = (options = {}) => {
  const {
    autoStart = false,
    delay = 1000,
    onComplete,
    onSkip,
  } = options;

  const {
    isOnboardingActive,
    currentStep,
    isCompleted,
    hasBeenShown,
    startOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
    getCurrentStep,
    shouldShowOnboarding,
  } = useOnboardingStore();

  // Auto-start onboarding if enabled
  useEffect(() => {
    if (autoStart && shouldShowOnboarding()) {
      const timer = setTimeout(() => {
        startOnboarding();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoStart, delay, shouldShowOnboarding, startOnboarding]);

  // Handle completion callback
  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  const handleComplete = () => {
    completeOnboarding();
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    if (onSkip) {
      onSkip();
    }
  };

  return {
    // State
    isOnboardingActive,
    currentStep,
    isCompleted,
    hasBeenShown,
    currentStepData: getCurrentStep(),
    totalSteps: useOnboardingStore.getState().steps.length,
    
    // Actions
    startOnboarding,
    nextStep,
    previousStep,
    skipOnboarding: handleSkip,
    completeOnboarding: handleComplete,
    resetOnboarding,
    
    // Utilities
    shouldShowOnboarding: shouldShowOnboarding(),
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === useOnboardingStore.getState().steps.length - 1,
  };
};

export default useOnboarding;
