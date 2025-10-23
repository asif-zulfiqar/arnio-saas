import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const ToneSelectionModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    tone,
    setTone,
    setCampaignSettings,
    getTones,
    toneOptions,
    currentCampaignId,
    isEditMode,
  } = useCampaignStore();

  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);

  // Convert API tone string to numeric value (0-1)
  const toneKeyToNumber = (toneKey) => {
    switch (toneKey) {
      case "casual":
        return 0.08;
      case "playful":
        return 0.25;
      case "supportive":
        return 0.42;
      case "balanced":
        return 0.58;
      case "urgent":
        return 0.75;
      case "professional":
        return 0.92;
      default:
        return 0.5;
    }
  };

  // Convert numeric value to API tone key
  const numberToToneKey = (number) => {
    if (number < 0.17) return "casual";
    else if (number < 0.33) return "playful";
    else if (number < 0.5) return "supportive";
    else if (number < 0.67) return "balanced";
    else if (number < 0.83) return "urgent";
    else return "professional";
  };

  // Map numeric tone to actual tone label from API
  const getToneLabel = () => {
    const toneKey = numberToToneKey(tone);
    const toneOption = toneOptions.find((option) => option.key === toneKey);
    return toneOption ? toneOption.label : "Balanced";
  };

  const handleToneChange = (e) => {
    setTone(parseFloat(e.target.value));
  };

  // Update slider background when tone changes
  useEffect(() => {
    if (sliderRef.current) {
      const value = tone;
      const min = 0;
      const max = 1;
      const percentage = ((value - min) / (max - min)) * 100;

      sliderRef.current.style.background = `linear-gradient(to right, #3b82f6 0%, #1447E6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    }
  }, [tone]);

  // Initialize slider when modal opens
  useEffect(() => {
    if (showCreateCampaignModal && createCampaignStep === "tone_selection") {
      getTones();

      // If tone is a string (from API), convert it to numeric
      if (typeof tone === "string") {
        const numericTone = toneKeyToNumber(tone);
        setTone(numericTone);
      }

      // Initialize slider background
      if (sliderRef.current) {
        const currentTone =
          typeof tone === "string" ? toneKeyToNumber(tone) : tone;
        const percentage = currentTone * 100;
        sliderRef.current.style.background = `linear-gradient(to right, #3b82f6 0%, #1447E6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
      }
    }
  }, [showCreateCampaignModal, createCampaignStep, tone, getTones, setTone]);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // If we have a campaign ID, save the tone settings
      if (currentCampaignId) {
        // Convert numeric tone back to API tone key for saving
        const toneKey = numberToToneKey(tone);
        const result = await setCampaignSettings({
          tone: toneKey,
        });

        if (!result.success) {
          console.error("Failed to save tone settings:", result.error);
        }
      }

      // Navigate to next step based on mode
      if (isEditMode) {
        goToNextStep("ciara_ai_agent_builder");
      } else {
        goToNextStep("loading");
      }
    } catch (error) {
      console.error("Error saving tone:", error);
      // Continue to next step anyway even if there's an error
      if (isEditMode) {
        goToNextStep("ciara_ai_agent_builder");
      } else {
        goToNextStep("loading");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!showCreateCampaignModal || createCampaignStep !== "tone_selection") {
    return null;
  }

  return (
    <Modal
      title="Ciara AI Agent Setup"
      onClose={closeCreateCampaignModal}
      width="w-[450px]"
      height="h-[291px]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            What tone should Ciara use when reaching out?
          </h3>
          <p className="text-sm text-[#4A5565] mb-0">
            Current tone:{" "}
            <span className="font-medium text-gray-900">{getToneLabel()}</span>
          </p>

          <div className="space-y-0 mt-4">
            <div className="relative py-2">
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={typeof tone === "string" ? toneKeyToNumber(tone) : tone}
                onChange={handleToneChange}
                className="w-full appearance-none cursor-pointer slider"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-[#4A5565] mt-2">
              <span>Casual & Friendly</span>
              <span>Professional & Formal</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-8">
          <button
            onClick={() => goToPreviousStep()}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Next"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider {
          height: 8px;
          border-radius: 4px;
          outline: none;
          background: linear-gradient(to right, #3b82f6 0%, #e5e7eb 100%);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 1px solid #3b82f6;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          margin-top: -6px;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 1px solid #3b82f6;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }

        .slider::-webkit-slider-thumb:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
          border: none;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }
      `}</style>
    </Modal>
  );
};

export default ToneSelectionModal;
