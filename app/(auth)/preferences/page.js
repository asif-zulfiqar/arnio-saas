"use client";

import { useState } from "react";
import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Preferences = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const { setReferralSource, setCurrentStep, prevStep } = useSignupStore();
  const { saveReferralSource, updateOnboardingStatus } = useAuthStore();

  // Referral sources with icons
  const referralSources = [
    { id: "instagram", name: "Instagram", icon: "/svgs/pre/insta.svg" },
    { id: "google", name: "Google", icon: "/svgs/pre/google.svg" },
    {
      id: "friends",
      name: "Friends / Coworker",
      icon: "/svgs/pre/friends.svg",
    },
    { id: "x", name: "X.com", icon: "/svgs/pre/x.svg" },
    { id: "reddit", name: "Reddit", icon: "/svgs/pre/reddit.svg" },
    {
      id: "billboard",
      name: "Billboard / Outside",
      icon: "/svgs/pre/billboard.svg",
    },
    { id: "facebook", name: "Facebook", icon: "/svgs/pre/facebook.svg" },
    { id: "podcast", name: "Podcast", icon: "/svgs/pre/podcast.svg" },
    { id: "youtube", name: "Youtube", icon: "/svgs/pre/youtube.svg" },
    { id: "newsletter", name: "Newsletter", icon: "/svgs/pre/newsletter.svg" },
    { id: "linkedin", name: "Linkedin", icon: "/svgs/pre/linkedin.svg" },
    { id: "other", name: "Other", icon: "/svgs/pre/other.svg" },
  ];

  // Handle source selection
  const handleSourceSelect = (sourceId) => {
    setSelectedSource(sourceId);
    setReferralSource(sourceId);
  };

  // Handle form submission
  const handleContinue = async () => {
    setIsLoading(true);

    try {
      // Save referral source if selected
      if (selectedSource) {
        const result = await saveReferralSource(selectedSource);
        if (!result.success) {
          console.error("Failed to save referral source:", result.error);
          // Continue anyway, don't block the flow
        }
      }

      // Don't mark as onboarded yet - let welcome screen handle this
      // User will be marked as onboarded when they click "Keep exploring" in welcome screen

      // Navigate to dashboard (which will show welcome screen)
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("Signup completion failed:", error);
      // Continue anyway, don't block the flow
      setTimeout(() => {
        router.push("/");
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip
  const handleSkip = async () => {
    setReferralSource("");
    
    // Don't mark as onboarded yet - let welcome screen handle this
    // User will be marked as onboarded when they click "Keep exploring" in welcome screen
    
    setTimeout(() => {
      router.push("/");
    }, 100);
  };

  return (
    <SignupLayout step={5}>
      <div className="w-full flex flex-col justify-between gap-8 h-full p-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            How did you heard about us?
          </h1>

          <p className="text-sm text-gray-500 mt-1 max-w-[380px]">
            Please select below where you found out about Arnio. This step is
            optional.
          </p>

          <div className="flex flex-wrap gap-[10px] mt-8">
            {referralSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceSelect(source.id)}
                className={`px-[10px] py-2 border-[0.5px] rounded-md shadow-sm flex items-center justify-center gap-1 transition-all duration-200 hover:border-gray-400 ${
                  selectedSource === source.id
                    ? "border-primary bg-blue-50 ring-1 ring-primary"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <Image src={source.icon} alt="icon" width={12} height={12} />
                <div className="text-xs font-medium text-gray-900">
                  {source.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            text={isLoading ? "Completing..." : "Continue"}
            onClick={handleContinue}
            disabled={isLoading}
            height="h-[41px]"
            cn="!text-sm"
          />

          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-600 hover:text-gray-900 text-center"
          >
            Skip
          </button>
        </div>
      </div>
    </SignupLayout>
  );
};

export default Preferences;
