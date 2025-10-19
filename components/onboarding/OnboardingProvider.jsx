"use client";
import React from "react";
import OnboardingModal from "./OnboardingModal";

const OnboardingProvider = ({ children }) => {
  // Don't automatically start onboarding - let welcome screen handle this
  // Onboarding will only start when user clicks "Keep exploring" in welcome screen

  return (
    <>
      {children}
      <OnboardingModal />
    </>
  );
};

export default OnboardingProvider;
