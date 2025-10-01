"use client";

import { useState } from "react";
import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import useSignupStore from "@/store/auth/signupStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Preferences = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const { setReferralSource, setCurrentStep, prevStep } = useSignupStore();

  // Referral sources with icons
  const referralSources = [
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "google", name: "Google", icon: "🔍" },
    { id: "friends", name: "Friends / Coworker", icon: "👥" },
    { id: "x", name: "X.com", icon: "🐦" },
    { id: "reddit", name: "Reddit", icon: "🤖" },
    { id: "billboard", name: "Billboard / Outside", icon: "📢" },
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "podcast", name: "Podcast", icon: "🎙️" },
    { id: "youtube", name: "Youtube", icon: "▶️" },
    { id: "newsletter", name: "Newsletter", icon: "📧" },
    { id: "linkedin", name: "Linkedin", icon: "💼" },
    { id: "other", name: "Other", icon: "⋯" },
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Here you would typically submit all the signup data to your API
      console.log("Signup completed with referral source:", selectedSource);
      
      // Navigate to dashboard or success page
      router.push("/");
    } catch (error) {
      console.error("Signup completion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip
  const handleSkip = () => {
    setReferralSource("");
    router.push("/");
  };

  // Handle back button
  const handleBack = () => {
    prevStep();
    router.push("/team-members");
  };

  return (
    <SignupLayout step={4}>
      <div className="w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center">
          How did you hear about us?
        </h1>
        
        <p className="text-sm text-gray-600 text-center mt-4">
          Please select below where you found out about Arnio. This step is optional.
        </p>

        <div className="mt-8">
          <div className="grid grid-cols-3 gap-3">
            {referralSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceSelect(source.id)}
                className={`p-4 border rounded-lg text-center transition-all duration-200 hover:border-gray-400 ${
                  selectedSource === source.id
                    ? "border-primary bg-blue-50 ring-1 ring-primary"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{source.icon}</div>
                <div className="text-xs font-medium text-gray-900">{source.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            text={isLoading ? "Completing..." : "Continue"}
            onClick={handleContinue}
            disabled={isLoading}
            bgColor="bg-primary hover:bg-blue-700"
            height="h-[41px]"
            cn="!text-sm"
          />

          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-600 hover:text-gray-900 text-center"
          >
            Skip
          </button>

          <button
            onClick={handleBack}
            className="w-full text-sm text-gray-600 hover:text-gray-900 text-center mt-2"
          >
            Back
          </button>
        </div>
      </div>
    </SignupLayout>
  );
};

export default Preferences;
