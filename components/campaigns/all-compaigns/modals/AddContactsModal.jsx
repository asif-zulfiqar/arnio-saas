import React, { useState } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const AddContactsModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    campaignFormData,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    setContactMethod,
    resetContactFlow,
  } = useCampaignStore();

  const [selectedMethod, setSelectedMethod] = useState(
    campaignFormData?.contactMethod || "csv"
  );

  const methods = [
    {
      id: "csv",
      label: "Import CSV/XLSX",
      description:
        "Upload a file with phone, name, email, tags. Best for large lists.",
    },
    {
      id: "existing",
      label: "Select from Existing",
      description: "Pick contacts already in your database.",
    },
    {
      id: "manual",
      label: "Add Manually",
      description: "Enter a few contacts one by one.",
    },
  ];

  const handleNext = () => {
    updateFormData({
      contactMethod: selectedMethod,
    });

    setContactMethod(selectedMethod);

    let nextStep;
    switch (selectedMethod) {
      case "csv":
        nextStep = "importContacts";
        break;
      case "existing":
        nextStep = "selectExisting";
        break;
      case "manual":
        nextStep = "addManual";
        break;
      default:
        nextStep = "importContacts";
    }

    goToNextStep(nextStep);
  };

  const handleBack = () => {
    resetContactFlow();
    goToPreviousStep();
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    updateFormData({ contactMethod: methodId });
  };

  if (!showCreateCampaignModal || createCampaignStep !== "addContacts") {
    return null;
  }

  return (
    <Modal
      title="Add Contacts"
      onClose={closeCreateCampaignModal}
      width="w-[800px]"
    >
      <div className="space-y-5">
        <div>
          <p className="text-gray-500 text-sm">
            Choose how you'd like to add contacts to this campaign
          </p>
        </div>

        <div className="space-y-2">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className={`flex items-start py-5 px-4 border rounded-lg cursor-pointer transition-all bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm `}
            >
              <div className="flex items-center h-6 mr-4">
                {selectedMethod === method.id ? (
                  <img
                    src="/svgs/campaigns/ellipse.svg"
                    alt="selected"
                    className="w-5 h-5"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium text-gray-900 text-base">
                  {method.label}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={handleBack}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddContactsModal;
