"use client";
import React, { useEffect } from "react";
import OnboardingModal from "./OnboardingModal";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

const OnboardingProvider = ({ children }) => {
  const { shouldShowOnboarding, startOnboarding } = useOnboardingStore();

  useEffect(() => {
    // Check if onboarding should be shown on component mount
    if (shouldShowOnboarding()) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding, startOnboarding]);

  return (
    <>
      {children}
      <OnboardingModal />
    </>
  );
};

export default OnboardingProvider;
