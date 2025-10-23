import React, { useState, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const CampaignSetupModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    campaignFormData,
    updateFormData,
    isEditMode,
    editingCampaignId,
    currentCampaignId, // ✅ ADD THIS - for add flow campaign ID
    editSource,
    createBasicCampaign,
    updateCampaign,
    loading,
  } = useCampaignStore();

  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (campaignFormData) {
      setCampaignName(campaignFormData.name || "");
      setDescription(campaignFormData.description || "");
    }
  }, [campaignFormData]);

  const handleNext = async () => {
    if (campaignName.trim()) {
      const campaignData = {
        name: campaignName.trim(),
        description: description.trim(),
      };

      updateFormData(campaignData);

      setIsSubmitting(true);

      try {
        // ✅ CHECK THE SOURCE OF THE EDIT
        const isFromSummaryEdit =
          editSource && editSource.startsWith("summary_");

        console.log("Edit source:", editSource);
        console.log("Is from summary edit:", isFromSummaryEdit);
        console.log("Is edit mode:", isEditMode);
        console.log("Editing campaign ID:", editingCampaignId);
        console.log("Current campaign ID:", currentCampaignId); // ✅ LOG THIS

        if (isFromSummaryEdit && currentCampaignId) {
          // ✅ SUMMARY EDIT FLOW IN ADD MODE: Use updateCampaign with currentCampaignId
          console.log(
            "Summary edit flow in add mode - calling updateCampaign API with ID:",
            currentCampaignId
          );
          const result = await updateCampaign(currentCampaignId, campaignData);

          if (!result.success) {
            console.error("Failed to update campaign:", result.error);
            return;
          }

          console.log("Campaign updated successfully via API");
          goToNextStep("reviewContacts");
        } else if (isEditMode && editingCampaignId) {
          // ✅ NORMAL EDIT FLOW: Use updateCampaign with editingCampaignId
          console.log(
            "Normal edit flow - calling updateCampaign API with ID:",
            editingCampaignId
          );
          const result = await updateCampaign(editingCampaignId, campaignData);

          if (!result.success) {
            console.error("Failed to update campaign:", result.error);
            return;
          }

          console.log("Campaign updated successfully via API");
          goToNextStep("reviewContacts");
        } else {
          // ✅ CREATE FLOW: Use createBasicCampaign
          console.log("Create flow - calling createBasicCampaign API");
          const result = await createBasicCampaign(campaignData);

          if (!result.success) {
            console.error("Failed to create campaign:", result.error);
            return;
          }

          goToNextStep("addContacts");
        }
      } catch (error) {
        console.error("Error in handleNext:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!showCreateCampaignModal || createCampaignStep !== "setup") {
    return null;
  }

  const isLoading = loading || isSubmitting;

  return (
    <Modal
      title={isEditMode ? "Edit Campaign" : "Ciara AI Agent Setup"}
      onClose={closeCreateCampaignModal}
      width="w-[450px]"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-2 leading-[150%]">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Abandoned Cart Reminder"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white leading-[125%]"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-900 mb-2 leading-[150%]">
            Campaign Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Send a discount code to customers who abandoned their cart last week"
            rows={3}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none leading-[125%]"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between pt-[14px]">
          <button
            onClick={closeCreateCampaignModal}
            disabled={isLoading}
            className="w-[71px] h-[37px] px-3 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors leading-[150%] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={!campaignName.trim() || isLoading}
            className="w-[56px] h-[37px] px-3 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed leading-[150%]"
          >
            {isLoading ? "..." : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignSetupModal;
