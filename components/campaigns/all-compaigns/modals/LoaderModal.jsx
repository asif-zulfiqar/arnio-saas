import React, { useState, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const LoaderModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    editSource,
    setEditSource,
    generateAICampaignDraft,
    isGeneratingContent,
  } = useCampaignStore();

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Gathering your campaign details…",
    "Training Ciara for this campaign…",
    "Generating Ciara's first message…",
  ];

  useEffect(() => {
    // Start AI generation when modal opens
    const generateContent = async () => {
      const result = await generateAICampaignDraft();
      if (!result.success) {
        console.error("Failed to generate AI content:", result.error);
        // Continue anyway
      }
    };

    if (showCreateCampaignModal && createCampaignStep === "loading") {
      generateContent();
    }
  }, [showCreateCampaignModal, createCampaignStep, generateAICampaignDraft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Only move to next step when AI generation is complete
          const checkCompletion = () => {
            if (!isGeneratingContent) {
              setTimeout(() => {
                // If we came from summary edit, go back to summary
                if (editSource && editSource.startsWith("summary_")) {
                  goToNextStep("ciara_ai_agent_builder");
                  setEditSource(null);
                } else {
                  goToNextStep("ciara_ai_agent_builder");
                }
              }, 1000);
            } else {
              // Check again in 500ms if still generating
              setTimeout(checkCompletion, 500);
            }
          };
          checkCompletion();
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [goToNextStep, steps.length, editSource, isGeneratingContent]);

  if (!showCreateCampaignModal || createCampaignStep !== "loading") {
    return null;
  }

  return (
    <Modal
      title="Getting Ciara AI ready..."
      onClose={closeCreateCampaignModal}
      width="w-[450px]"
      height="h-[250px]"
    >
      <div className="flex flex-col items-center justify-center py-8 px-6">
        <p className="text-sm text-gray-700 leading-[150%] mb-5 text-center">
          We're preparing your campaign and teaching Ciara how to manage this
          flow for you.
        </p>

        <div className="flex justify-center mb-5">
          <div className="animate-spin rounded-full h-[50px] w-[50px] border-4 border-gray-200 border-t-blue-600"></div>
        </div>

        <p className="text-sm font-medium text-gray-900 leading-5 text-center">
          {steps[currentStep]}
        </p>

        {isGeneratingContent && currentStep === steps.length - 1 && (
          <p className="text-xs text-gray-500 mt-2">Finalizing AI content...</p>
        )}
      </div>
    </Modal>
  );
};

export default LoaderModal;
