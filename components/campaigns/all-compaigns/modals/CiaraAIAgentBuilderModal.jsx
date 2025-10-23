import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import { RefreshCw } from "lucide-react";
import campaignToaster from "@/utils/campaignToast";

const CiaraAIAgentBuilderModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    businessInfo,
    firstMessage,
    setBusinessInfo,
    setFirstMessage,
    aiGeneratedContent,
    regenerateAIContent,
    saveCampaignSummary,
    updateCampaignStatus,
    loadCampaigns,
    isEditMode,
    getCampaignSummary,
    getTargetCampaignId,
  } = useCampaignStore();

  const [localBusinessInfo, setLocalBusinessInfo] = useState(businessInfo);
  const [localFirstMessage, setLocalFirstMessage] = useState(firstMessage);
  const [isSaving, setIsSaving] = useState(false);
  const [savingAction, setSavingAction] = useState(null); // 'draft' or 'continue'

  // Get the correct campaign ID (edit mode vs create mode)
  const targetCampaignId = getTargetCampaignId();

  // Update local state when store data changes
  useEffect(() => {
    setLocalBusinessInfo(businessInfo);
    setLocalFirstMessage(firstMessage);
  }, [businessInfo, firstMessage]);

  // EDIT FLOW: Load existing campaign summary data when modal opens
  useEffect(() => {
    const loadExistingData = async () => {
      if (
        showCreateCampaignModal &&
        createCampaignStep === "ciara_ai_agent_builder" &&
        isEditMode
      ) {
        try {
          // Fetch existing campaign summary for edit mode
          const summaryResult = await getCampaignSummary();
          if (summaryResult.success && summaryResult.data) {
            const summary = summaryResult.data;

            // Update first message with existing data
            if (summary.campaign?.messageBody) {
              setLocalFirstMessage(summary.campaign.messageBody);
              setFirstMessage(summary.campaign.messageBody);
            }
          }
        } catch (error) {
          console.error("Failed to load campaign summary for edit:", error);
        }
      }
    };

    loadExistingData();
  }, [
    showCreateCampaignModal,
    createCampaignStep,
    isEditMode,
    getCampaignSummary,
    setFirstMessage,
    targetCampaignId,
  ]);

  const handleRegeneratePreview = () => {
    // Go back to loading to regenerate content
    regenerateAIContent();
  };

  const handleSaveDraft = async () => {
    setSavingAction("draft");
    setIsSaving(true);
    try {
      // Save business info and first message locally
      setBusinessInfo(localBusinessInfo);
      setFirstMessage(localFirstMessage);

      // ✅ CRITICAL: ALWAYS save the message to API (both add and edit flow)
      if (targetCampaignId && localFirstMessage) {
        const saveResult = await saveCampaignSummary(localFirstMessage);

        if (!saveResult.success) {
          console.error("Failed to save campaign summary:", saveResult.error);
        }
      }

      // Update campaign status to draft
      if (targetCampaignId) {
        const result = await updateCampaignStatus(targetCampaignId, "draft");

        if (result.success) {
          // ✅  DRAFT TOAST HERE
          campaignToaster.draft();
          // Refresh the campaigns list to show the updated status
          await loadCampaigns({ page: 1 });
          // Close the modal
          closeCreateCampaignModal();
        } else {
          console.error("Failed to update campaign status:", result.error);
        }
      } else {
        console.warn("No target campaign ID found for saving draft");
        // Close modal anyway
        closeCreateCampaignModal();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      // Close modal even if there's an error
      closeCreateCampaignModal();
    } finally {
      setIsSaving(false);
      setSavingAction(null);
    }
  };

  const handleApproveContinue = async () => {
    setSavingAction("continue");
    setIsSaving(true);
    try {
      // Save business info and first message locally
      setBusinessInfo(localBusinessInfo);
      setFirstMessage(localFirstMessage);

      // ✅ CRITICAL: ALWAYS save the message to API BEFORE moving to next step
      if (targetCampaignId && localFirstMessage) {
        console.log(
          "Saving message to API before navigation:",
          localFirstMessage
        );
        const saveResult = await saveCampaignSummary(localFirstMessage);
        console.log("Save campaign summary result:", saveResult);

        if (!saveResult.success) {
          console.error("Failed to save campaign summary:", saveResult.error);
          // Wait a bit to ensure the API call completes
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          // Wait a bit to ensure the API call completes and data is persisted
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // Update campaign status to active
      if (targetCampaignId) {
        await updateCampaignStatus(targetCampaignId, "active");
      }

      // Move to next step - NOW the message is saved and summary modal will get updated data
      goToNextStep("campaign_summary");
    } catch (error) {
      console.error("Error in Approve & Continue:", error);
      // Continue to next step anyway
      goToNextStep("campaign_summary");
    } finally {
      setIsSaving(false);
      setSavingAction(null);
    }
  };

  // Format the business info with bullet points
  const formattedBusinessInfo = localBusinessInfo
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
      return `• ${cleanLine}`;
    })
    .join("\n");

  const handleBusinessInfoChange = (e) => {
    const value = e.target.value;
    setLocalBusinessInfo(value);
  };

  // Update preview in REAL-TIME when message changes
  const handleFirstMessageChange = (e) => {
    const newMessage = e.target.value;
    setLocalFirstMessage(newMessage);
    // Also update store immediately so preview updates
    setFirstMessage(newMessage);
  };

  // Use AI generated preview if available, but update preview in real-time
  const getPreviewMessages = () => {
    // Use the CURRENT localFirstMessage for real-time preview updates
    const currentMessage =
      localFirstMessage ||
      "Hey {{FirstName}}, noticed you left something in your cart 👀 Want me to save it for you?";

    // CREATE MODE: Use AI generated preview if available, but with updated first message
    if (aiGeneratedContent?.proposal?.preview && !isEditMode) {
      return [
        {
          from: "agent",
          text: currentMessage, // Use current message instead of AI generated one
        },
        ...aiGeneratedContent.proposal.preview.slice(1), // Keep the rest of the AI preview
      ];
    }

    // Fallback to default preview with current message
    return [
      {
        from: "agent",
        text: currentMessage,
      },
      {
        from: "client",
        text: "h thanks, I was still deciding.",
      },
      {
        from: "agent",
        text: "No worries! Just so you know, we've got a 30-day return policy if it's not the right fit.",
      },
    ];
  };

  const previewMessages = getPreviewMessages();

  if (
    !showCreateCampaignModal ||
    createCampaignStep !== "ciara_ai_agent_builder"
  ) {
    return null;
  }

  return (
    <Modal
      title="Ciara AI Agent Builder"
      onClose={closeCreateCampaignModal}
      width="w-[888px]"
    >
      <div className="space-y-5">
        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-semibold text-gray-900">
                  What should Ciara know about your business?
                </label>
              </div>
              <textarea
                value={formattedBusinessInfo}
                onChange={handleBusinessInfoChange}
                rows={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                placeholder="• We sell affordable, high-quality fashion basics.
• If customer hesitates, remind them about our 30-day return policy.
• Tone: friendly, casual, supportive."
              />
              <p className="mt-1 text-xs text-gray-500">
                Start each line with • for bullet points
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                What should Ciara say first when reaching out?
              </label>
              <textarea
                value={localFirstMessage}
                onChange={handleFirstMessageChange} // Use the new handler
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                placeholder="Hey {{FirstName}}, noticed you left something in your cart 👀 Want me to save it for you?"
              />
              <p className="mt-1 text-xs text-gray-500">
                This message will be saved as the campaign's opening message
              </p>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-semibold text-gray-900">Preview</h3>
              <button
                onClick={handleRegeneratePreview}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                disabled={isSaving}
              >
                <RefreshCw
                  size={16}
                  className="text-gray-600"
                  strokeWidth={3}
                />
                Regenerate Preview
              </button>
            </div>

            <div className="space-y-5">
              {previewMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.from === "agent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-3xl px-6 py-5 max-w-[85%] ${
                      message.from === "agent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => goToPreviousStep()}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            disabled={isSaving}
          >
            Back
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {savingAction === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handleApproveContinue}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !localFirstMessage.trim()}
            >
              {savingAction === "continue" ? "Saving..." : "Approve & Continue"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CiaraAIAgentBuilderModal;
