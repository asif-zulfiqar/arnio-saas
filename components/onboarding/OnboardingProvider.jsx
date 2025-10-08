"use client";
import { useEffect } from "react";
import OnboardingSpotlight from "./OnboardingSpotlight";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

const OnboardingProvider = ({ children, shouldShowOnboarding = true }) => {
  const { startOnboarding, shouldShowOnboarding: storeShouldShow } = useOnboardingStore();

  useEffect(() => {
    // Check if onboarding should be shown
    if (shouldShowOnboarding && storeShouldShow()) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding, storeShouldShow, startOnboarding]);

  return (
    <>
      {children}
      <OnboardingSpotlight />
    </>
  );
};

export default OnboardingProvider;
