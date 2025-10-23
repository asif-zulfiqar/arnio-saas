import React, { useState, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import { Edit } from "lucide-react";
import campaignToaster from "@/utils/campaignToast";

const CampaignSummaryModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToPreviousStep,
    goToNextStep,
    campaignFormData,
    campaignType,
    ecommerceType,
    tone,
    firstMessage,
    accumulatedContacts,
    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    isEditMode,
    setEditSource,
    customCampaignIdea,
    // Scheduling data
    selectedPhoneNumbers,
    dailySendingCapacity,
    estimatedCompletion,
    campaignStartDate,
    // API data
    getCampaignSummary,
    campaignSummary,
    currentCampaignId,
    editingCampaignId,
    getTargetCampaignId, // ✅ ADD THIS
    // List actions
    loadCampaigns,
  } = useCampaignStore();

  const [isLoading, setIsLoading] = useState(false);
  const [savingAction, setSavingAction] = useState(null); // 'draft' or 'publish'

  // ✅ USE THE CORRECT CAMPAIGN ID FOR BOTH FLOWS
  const targetCampaignId = getTargetCampaignId();

  // Fetch campaign summary when modal opens - FIXED to use targetCampaignId
  useEffect(() => {
    const fetchSummary = async () => {
      if (
        showCreateCampaignModal &&
        createCampaignStep === "campaign_summary" &&
        targetCampaignId // ✅ USE targetCampaignId INSTEAD OF currentCampaignId
      ) {
        setIsLoading(true);
        try {
          await getCampaignSummary();
        } catch (error) {
          console.error("Failed to load campaign summary:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSummary();
  }, [
    showCreateCampaignModal,
    createCampaignStep,
    targetCampaignId, // ✅ USE targetCampaignId HERE
    getCampaignSummary,
  ]);

  const handleEditSection = (section) => {
    switch (section) {
      case "campaign_info":
        setEditSource("summary_campaign_info");
        goToNextStep("setup");
        break;
      case "contacts":
        setEditSource("summary_contacts");
        goToNextStep("reviewContacts");
        break;
      case "scheduling":
        setEditSource("summary_scheduling");
        goToNextStep("scheduling");
        break;
      case "ciara_setup":
        setEditSource("summary_campaign_info");
        goToNextStep("ciara_agent_setup");
        break;
      case "ecommerce_type":
        setEditSource("summary_campaign_info");
        goToNextStep("ecommerce_type");
        break;
      case "tone":
        setEditSource("summary_campaign_info");
        goToNextStep("tone_selection");
        break;
      case "ai_builder":
        setEditSource("summary_campaign_info");
        goToNextStep("ciara_ai_agent_builder");
        break;
      default:
        break;
    }
  };

  const handleSaveDraft = async () => {
    setSavingAction("draft");
    setIsLoading(true);
    try {
      // ✅ USE targetCampaignId FOR BOTH FLOWS
      if (targetCampaignId) {
        const result = await updateCampaignStatus(targetCampaignId, "draft");
        if (result.success) {
          // ✅  DRAFT TOAST HERE
          campaignToaster.draft();
          // Refresh the campaigns list to show the updated status
          await loadCampaigns({ page: 1 });
          // Close the modal
          closeCreateCampaignModal();
        }
      } else {
        // Only create new campaign if we don't have an ID (shouldn't happen in edit mode)
        const result = await createCampaign(
          {
            name: campaignFormData?.name || "New Campaign",
            description:
              campaignFormData?.description || "Campaign description",
          },
          "draft"
        );
        if (result.success) {
          // ✅ Toast for draft saved
          campaignToaster.draft();
          // Refresh the campaigns list to show the new campaign
          await loadCampaigns({ page: 1 });
          // Close the modal
          closeCreateCampaignModal();
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
      setSavingAction(null);
    }
  };

  const handlePublishOrSaveChanges = async () => {
    setSavingAction("publish");
    setIsLoading(true);
    try {
      // ✅ USE targetCampaignId FOR BOTH FLOWS
      if (targetCampaignId) {
        const result = await updateCampaignStatus(targetCampaignId, "active");
        if (result.success) {
          // Refresh the campaigns list to show the updated status
          // ✅ ADD TOAST HERE
          if (isEditMode) {
            campaignToaster.update(
              "Campaign updated",
              "Your changes have been saved successfully."
            );
          } else {
            campaignToaster.success();
          }
          await loadCampaigns({ page: 1 });
          // Close the modal
          closeCreateCampaignModal();
        }
      } else {
        // Only create new campaign if we don't have an ID (shouldn't happen in edit mode)
        const result = await createCampaign(
          {
            name: campaignFormData?.name || "New Campaign",
            description:
              campaignFormData?.description || "Campaign description",
          },
          "active"
        );
        if (result.success) {
          campaignToaster.success();
          // Refresh the campaigns list to show the new campaign
          await loadCampaigns({ page: 1 });
          // Close the modal
          closeCreateCampaignModal();
        }
      }
    } catch (error) {
      console.error("Error publishing campaign:", error);
    } finally {
      setIsLoading(false);
      setSavingAction(null);
    }
  };

  if (!showCreateCampaignModal || createCampaignStep !== "campaign_summary") {
    return null;
  }

  // Use API data if available, otherwise fallback to local state
  const campaignData = campaignSummary?.campaign || {};
  const contactsData = campaignSummary?.contacts || {};
  const sendingData = campaignSummary?.sending || {};

  return (
    <Modal
      title={isEditMode ? "Edit Campaign Summary" : "Campaign Summary"}
      onClose={closeCreateCampaignModal}
      width="w-[564px]"
    >
      <div className="space-y-4">
        {/* Campaign Info */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => handleEditSection("campaign_info")}
          >
            <Edit size={18} />
          </button>
          <h3 className="text-base font-medium text-gray-900 mb-[18px]">
            Campaign Info
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name:</p>
              <p className="text-sm font-medium text-gray-800">
                {campaignData.name ||
                  campaignFormData?.name ||
                  "Abandoned Cart Reminder"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Description:</p>
              <p className="text-sm font-medium text-gray-800">
                {campaignData.description ||
                  campaignFormData?.description ||
                  "Send a discount code to customers who abandoned their cart last two weeks"}
              </p>
            </div>
          </div>
        </div>

        {/* Contacts - API DATA */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => handleEditSection("contacts")}
          >
            <Edit size={18} />
          </button>
          <h3 className="text-base font-medium text-gray-900 mb-[18px]">
            Contacts
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total contacts uploaded:</p>
            <span className="bg-gray-100 px-3 py-0.5 rounded-md text-xs font-medium text-gray-900">
              {contactsData.total
                ? contactsData.total.toLocaleString()
                : accumulatedContacts.length.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sending Strategy - API DATA */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => handleEditSection("scheduling")}
          >
            <Edit size={18} />
          </button>
          <h3 className="text-base font-medium text-gray-900 mb-[18px]">
            Sending Strategy
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Phone numbers assigned</p>
              <span className="bg-gray-100 px-3 py-0.5 rounded-md text-xs font-medium text-gray-900">
                {sendingData.senderNumbers
                  ? sendingData.senderNumbers.length
                  : selectedPhoneNumbers?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Daily sending capacity:</p>
              <span className="bg-gray-100 px-3 py-0.5 rounded-md text-xs font-medium text-gray-900">
                {sendingData.dailyCapacity
                  ? `${sendingData.dailyCapacity}/day`
                  : `${dailySendingCapacity}/day`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Estimated completion:</p>
              <p className="text-xs font-medium text-gray-900 bg-gray-100 px-3 py-0.5 rounded-md">
                {sendingData.estimatedCompletion
                  ? new Date(
                      sendingData.estimatedCompletion
                    ).toLocaleDateString()
                  : estimatedCompletion
                  ? estimatedCompletion.toLocaleDateString()
                  : "Oct 22, 2025"}
                <span className="text-gray-500">
                  {sendingData.durationDays
                    ? ` (~${sendingData.durationDays} days)`
                    : campaignStartDate && estimatedCompletion
                    ? ` (~${Math.ceil(
                        (estimatedCompletion - campaignStartDate) /
                          (1000 * 60 * 60 * 24)
                      )} days)`
                    : " (~30 days)"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Message Preview - API DATA */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => handleEditSection("ai_builder")}
          >
            <Edit size={18} />
          </button>
          <h3 className="text-base font-medium text-gray-900 mb-[18px]">
            Message Preview
          </h3>
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-3xl px-6 py-5 max-w-[85%]">
              <p className="text-sm leading-relaxed">
                {campaignData.messageBody ||
                  firstMessage ||
                  "Hey Alex, noticed you left something in your cart 👀 Want me to save it for you?"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-1">
          <button
            onClick={() => goToPreviousStep()}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            disabled={isLoading}
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {savingAction === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublishOrSaveChanges}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {savingAction === "publish"
                ? isEditMode
                  ? "Saving..."
                  : "Publishing..."
                : isEditMode
                ? "Save Changes"
                : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignSummaryModal;
