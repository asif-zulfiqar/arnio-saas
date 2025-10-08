"use client";
import { OnboardingTrigger, useOnboardingStore } from "@/components/onboarding";
import { motion } from "framer-motion";

const OnboardingDemo = () => {
  const { isOnboardingActive, currentStep, isCompleted, hasBeenShown } = useOnboardingStore();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Demo</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <OnboardingTrigger variant="button" size="default">
            Start Onboarding Tour
          </OnboardingTrigger>
          
          <OnboardingTrigger variant="icon" size="default" />
          
          <OnboardingTrigger variant="link">
            Start with link
          </OnboardingTrigger>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Status:</strong> {isOnboardingActive ? "Active" : "Inactive"}</p>
          <p><strong>Current Step:</strong> {currentStep + 1}</p>
          <p><strong>Completed:</strong> {isCompleted ? "Yes" : "No"}</p>
          <p><strong>Has Been Shown:</strong> {hasBeenShown ? "Yes" : "No"}</p>
        </div>

        {isOnboardingActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-blue-800 text-sm">
              🎉 Onboarding is currently active! Check the modal overlay.
            </p>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-800 text-sm">
              ✅ Onboarding completed successfully!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OnboardingDemo;
