import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import { ChevronDown, Lightbulb } from "lucide-react";
import Image from "next/image";

const CiaraAgentSetupModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    campaignType,
    setCampaignType,
    customCampaignIdea,
    setCustomCampaignIdea,
    isEditMode,
    // New APIs
    getCampaignTypes,
    setCampaignSettings,
    campaignTypes,
    loading,
  } = useCampaignStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const [localCustomIdea, setLocalCustomIdea] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const buttonRef = useRef(null);

  // Load campaign types when modal opens
  useEffect(() => {
    const loadCampaignTypes = async () => {
      if (
        showCreateCampaignModal &&
        createCampaignStep === "ciara_agent_setup"
      ) {
        setIsLoadingTypes(true);
        try {
          await getCampaignTypes();
        } catch (error) {
          console.error("Failed to load campaign types:", error);
        } finally {
          setIsLoadingTypes(false);
        }
      }
    };

    loadCampaignTypes();
  }, [showCreateCampaignModal, createCampaignStep, getCampaignTypes]);

  // Pre-fill data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      // If it's edit mode and campaign type is "Other", pre-fill the custom idea
      if (campaignType === "OTHER" && customCampaignIdea) {
        setLocalCustomIdea(customCampaignIdea);
      }
    }
  }, [isEditMode, campaignType, customCampaignIdea]);

  const handleNext = async () => {
    if (!campaignType) {
      setError(true);
      return;
    }

    if (campaignType === "OTHER") {
      if (!localCustomIdea.trim()) {
        setError(true);
        return;
      }

      // Set custom campaign idea
      setCustomCampaignIdea(localCustomIdea);

      // Save campaign settings via API
      const settings = {
        campaignType: localCustomIdea.trim(), // Use custom idea as campaign type for "Other"
      };

      const result = await setCampaignSettings(settings);
      if (!result.success) {
        console.error("Failed to save campaign settings:", result.error);
        return;
      }

      // In edit mode, skip confirmation and go directly to next step
      if (isEditMode) {
        goToNextStep("ecommerce_type");
      } else {
        setShowConfirmation(true);
      }
    } else {
      // Clear custom idea if not "Other"
      setCustomCampaignIdea("");

      // Save campaign settings via API
      const settings = {
        campaignType: campaignType,
      };

      const result = await setCampaignSettings(settings);
      if (!result.success) {
        console.error("Failed to save campaign settings:", result.error);
        return;
      }

      goToNextStep("ecommerce_type");
    }
  };

  const handleConfirmationOk = () => {
    setShowConfirmation(false);
    goToNextStep("ecommerce_type");
  };

  const handleTypeSelect = (type) => {
    setCampaignType(type.key);
    setShowDropdown(false);
    setError(false);
    // Clear custom idea when switching away from "Other"
    if (type.key !== "OTHER") {
      setLocalCustomIdea("");
      setCustomCampaignIdea("");
    }
  };

  if (!showCreateCampaignModal || createCampaignStep !== "ciara_agent_setup") {
    return null;
  }

  const getDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      };
    }
    return null;
  };

  const dropdownPosition = showDropdown ? getDropdownPosition() : null;
  const isOtherSelected = campaignType === "OTHER";

  // Find the selected campaign type label
  const selectedCampaignType = campaignTypes.find(
    (type) => type.key === campaignType
  );
  const selectedLabel = selectedCampaignType
    ? selectedCampaignType.label
    : campaignType;

  const modalHeight = isOtherSelected ? "h-[380px]" : "h-[293px]";

  // Confirmation View (only for create mode)
  if (showConfirmation && !isEditMode) {
    return (
      <Modal
        title="Ciara AI Agent Setup"
        onClose={closeCreateCampaignModal}
        width="w-[450px]"
        height="h-[293px]"
      >
        <p className="text-sm text-gray-500 mb-11">
          Ciara is your AI Agent who helps manage outreach campaigns
        </p>
        <div className="flex flex-col items-center justify-center h-full text-center ">
          <div className="flex flex-col items-center justify-center h-full text-center px-5">
            <div className="bg-[#F3F4F6] rounded-full p-3 mb-5">
              <Image
                src="/svgs/campaigns/bulbicon.svg"
                alt="Bulb Icon"
                width={16.33}
                height={23.33}
                className="object-contain"
              />
            </div>
            <p className="text-base text-gray-900 font-medium mb-1">
              Thanks for sharing!
            </p>
            <p className="text-base text-gray-500 mb-[54px]">
              We'll use your input to improve future campaigns.
            </p>
          </div>
          <button
            onClick={handleConfirmationOk}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            OK
          </button>
        </div>
      </Modal>
    );
  }

  // Main Form View
  return (
    <>
      <Modal
        title={isEditMode ? "Edit Campaign Setup" : "Ciara AI Agent Setup"}
        onClose={closeCreateCampaignModal}
        width="w-[450px]"
        height={modalHeight}
      >
        <div className="flex flex-col h-full">
          <p className="text-sm text-gray-500 mb-6">
            Ciara is your AI Agent who helps manage outreach campaigns
          </p>

          <div className="flex-1 mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Campaign Type
            </label>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() =>
                  !isLoadingTypes && setShowDropdown(!showDropdown)
                }
                disabled={isLoadingTypes}
                className={`w-full flex justify-between items-center px-4 py-3 border rounded-lg text-sm text-left bg-gray-50 ${
                  error ? "border-red-500" : "border-gray-300 "
                } hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span
                  className={campaignType ? "text-gray-900" : "text-gray-400"}
                >
                  {isLoadingTypes
                    ? "Loading campaign types..."
                    : selectedLabel || "Select..."}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Custom Idea Input - Only shown when "Other" is selected */}
            {isOtherSelected && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Describe your campaign idea
                </label>
                <input
                  type="text"
                  value={localCustomIdea}
                  onChange={(e) => {
                    setLocalCustomIdea(e.target.value);
                    if (e.target.value.trim()) {
                      setError(false);
                    }
                  }}
                  placeholder="e.g. Birthday offer for loyal customers"
                  className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-gray-400 bg-gray-50 ${
                    error && !localCustomIdea.trim()
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {error && !localCustomIdea.trim() && (
                  <p className="text-red-500 text-xs mt-2">
                    Please describe your campaign idea
                  </p>
                )}
              </div>
            )}

            {error && !campaignType && (
              <p className="text-red-500 text-xs mt-2">
                Please select a campaign type
              </p>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-3 ">
            <button
              onClick={() => goToPreviousStep()}
              disabled={loading}
              className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              {isEditMode ? "Back" : "Cancel"}
            </button>
            <button
              onClick={handleNext}
              disabled={loading || (isOtherSelected && !localCustomIdea.trim())}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Dropdown rendered outside modal */}
      {showDropdown && dropdownPosition && !isLoadingTypes && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setShowDropdown(false)}
        >
          <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {campaignTypes.map((type, index) => (
              <div
                key={type.key}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleTypeSelect(type)}
              >
                <div className="font-medium text-sm text-gray-900">
                  {type.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {type.description}
                </div>
              </div>
            ))}

            {campaignTypes.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No campaign types available
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CiaraAgentSetupModal;
