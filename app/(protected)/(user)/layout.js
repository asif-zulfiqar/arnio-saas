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

  // Determine what to show based on onboarding status
  useEffect(() => {
    console.log("Layout - User isOnboarded:", user?.isOnboarded);
    console.log("Layout - shouldShowOnboarding():", shouldShowOnboarding());
    
    if (user && user.isOnboarded) {
      // User is onboarded - don't show onboarding popups or welcome screen
      console.log("Layout - User is onboarded, not showing onboarding popups or welcome screen");
      setIsWelcomeScreen(false);
    } else if (user && !user.isOnboarded) {
      // User completed signup but not onboarded yet - show welcome screen
      console.log("Layout - User completed signup, showing welcome screen");
      setIsWelcomeScreen(true);
    } else {
      // Fallback: don't show welcome screen if no user data
      console.log("Layout - No user data, not showing welcome screen");
      setIsWelcomeScreen(false);
    }
  }, [user]);


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
