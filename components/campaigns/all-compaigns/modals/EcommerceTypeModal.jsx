import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import { ChevronDown } from "lucide-react";

const EcommerceTypeModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    ecommerceType,
    setEcommerceType,
    // New APIs
    getBusinessTypes,
    setCampaignSettings,
    businessTypes,
    loading,
  } = useCampaignStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const buttonRef = useRef(null);

  // Load business types when modal opens
  useEffect(() => {
    const loadBusinessTypes = async () => {
      if (showCreateCampaignModal && createCampaignStep === "ecommerce_type") {
        setIsLoadingTypes(true);
        try {
          await getBusinessTypes();
        } catch (error) {
          console.error("Failed to load business types:", error);
        } finally {
          setIsLoadingTypes(false);
        }
      }
    };

    loadBusinessTypes();
  }, [showCreateCampaignModal, createCampaignStep, getBusinessTypes]);

  const handleNext = async () => {
    if (!ecommerceType) {
      setError(true);
      return;
    }

    // Save ecommerce type via API
    const settings = {
      ecommerceType: ecommerceType,
    };

    const result = await setCampaignSettings(settings);
    if (!result.success) {
      console.error("Failed to save business type:", result.error);
      return;
    }

    goToNextStep("tone_selection");
  };

  const handleTypeSelect = (type) => {
    setEcommerceType(type.key);
    setShowDropdown(false);
    setError(false);
  };

  if (!showCreateCampaignModal || createCampaignStep !== "ecommerce_type") {
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

  // Find the selected business type label
  const selectedBusinessType = businessTypes.find(
    (type) => type.key === ecommerceType
  );
  const selectedLabel = selectedBusinessType
    ? selectedBusinessType.label
    : ecommerceType;

  return (
    <>
      <Modal
        title="Ciara AI Agent Setup"
        onClose={closeCreateCampaignModal}
        width="w-[450px]"
        height="h-[255px]"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <label className="block text-base font-semibold text-gray-900 mb-4">
              What type of eCommerce business are you?
            </label>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() =>
                  !isLoadingTypes && setShowDropdown(!showDropdown)
                }
                disabled={isLoadingTypes}
                className={`w-full flex justify-between items-center bg-gray-50 px-4 py-3 border rounded-lg text-sm text-left ${
                  error ? "border-red-500" : "border-gray-300"
                } hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span
                  className={ecommerceType ? "text-gray-900" : "text-gray-400"}
                >
                  {isLoadingTypes
                    ? "Loading business types..."
                    : selectedLabel || "Select your business type..."}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">
                Please select a business type
              </p>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-6">
            <button
              onClick={() => goToPreviousStep()}
              disabled={loading}
              className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!ecommerceType || loading}
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
            {businessTypes.map((type) => (
              <div
                key={type.key}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg text-sm text-gray-700"
                onClick={() => handleTypeSelect(type)}
              >
                {type.label}
              </div>
            ))}

            {businessTypes.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No business types available
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EcommerceTypeModal;
