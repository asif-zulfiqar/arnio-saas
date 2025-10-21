"use client";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import Welcome from "@/components/welcome/Welcome";
import OnboardingProvider from "@/components/onboarding/OnboardingProvider";
import useOnboardingStore from "@/store/onboarding/onboardingStore";
import useAuthStore from "@/store/auth/authStore";
import { useState, useEffect } from "react";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
  const [showWelcomeAfterOnboarding, setShowWelcomeAfterOnboarding] = useState(false);
  
  const { shouldShowOnboarding } = useOnboardingStore();
  const { user } = useAuthStore();

  const handleToggle = () => setIsSidebarOpen((s) => !s);

  // Determine what to show based on onboarding status - optimized for performance
  useEffect(() => {
    console.log("Layout - User isOnboarded:", user?.isOnboarded);
    console.log("Layout - shouldShowOnboarding():", shouldShowOnboarding());
    
    // Don't show welcome screen if user data is not fully loaded or if user is onboarded
    if (!user || !user.id || user.isOnboarded) {
      console.log("Layout - User data not fully loaded or user is onboarded, not showing welcome screen");
      setIsWelcomeScreen(false);
      return;
    }
    
    // Only show welcome screen if user completed signup but not onboarded yet
    if (!user.isOnboarded) {
      console.log("Layout - User completed signup, showing welcome screen");
      setIsWelcomeScreen(true);
    } else {
      console.log("Layout - Fallback, not showing welcome screen");
      setIsWelcomeScreen(false);
    }
  }, [user?.isOnboarded, user?.id]); // Only depend on specific user properties to prevent unnecessary re-renders


  return (
    <OnboardingProvider>
      <main className="min-h-screen min-w-screen bg-[#F9FAFB] flex flex-col">
        <Header isSidebarOpen={isSidebarOpen} onToggle={handleToggle} />
        <section className="flex flex-1">
          <LeftSidebar isOpen={isSidebarOpen} />
          <section className="flex-1 p-5">{children}</section>
        </section>
        {isWelcomeScreen && <Welcome onClose={setIsWelcomeScreen} />}
      </main>
    </OnboardingProvider>
  );
};

export default UserLayout;
