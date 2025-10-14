"use client";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import Welcome from "@/components/welcome/Welcome";
import OnboardingProvider from "@/components/onboarding/OnboardingProvider";
import { useState } from "react";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  const handleToggle = () => setIsSidebarOpen((s) => !s);

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
