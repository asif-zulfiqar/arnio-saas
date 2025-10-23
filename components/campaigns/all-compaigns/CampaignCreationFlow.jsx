// components/campaigns/CampaignCreationFlow.js
import React from "react";
import useCampaignStore from "@/store/campaigns/campaignStore";
import CampaignSetupModal from "./modals/CampaignSetupModal";
import AddContactsModal from "./modals/AddContactsModal";
import ImportContactsModal from "./modals/ImportContactsModal";
import SelectExistingContactsModal from "./modals/SelectExistingContactsModal";
import AddManualContactsModal from "./modals/AddManualContactsModal";
import ReviewUploadedContactsModal from "./modals/ReviewUploadedContactsModal";
import SchedulingModal from "./modals/SchedulingModal";
import CiaraAgentSetupModal from "./modals/CiaraAgentSetupModal";
import EcommerceTypeModal from "./modals/EcommerceTypeModal";
import ToneSelectionModal from "./modals/ToneSelectionModal";
import LoaderModal from "./modals/LoaderModal";
import CiaraAIAgentBuilderModal from "./modals/CiaraAIAgentBuilderModal";
import CampaignSummaryModal from "./modals/CampaignSummaryModal";

const CampaignCreationFlow = () => {
  const { createCampaignStep, isEditMode } = useCampaignStore();

  const renderModal = () => {
    switch (createCampaignStep) {
      case "setup":
        return <CampaignSetupModal />;
      case "addContacts":
        // Skip contact collection in edit mode
        if (isEditMode) {
          return <ReviewUploadedContactsModal />;
        }
        return <AddContactsModal />;
      case "importContacts":
        return <ImportContactsModal />;
      case "selectExisting":
        return <SelectExistingContactsModal />;
      case "addManual":
        return <AddManualContactsModal />;
      case "reviewContacts":
        return <ReviewUploadedContactsModal />;
      case "scheduling":
        return <SchedulingModal />;
      case "ciara_agent_setup":
        return <CiaraAgentSetupModal />;
      case "ecommerce_type":
        return <EcommerceTypeModal />;
      case "tone_selection":
        return <ToneSelectionModal />;
      case "loading":
        return <LoaderModal />;
      case "ciara_ai_agent_builder":
        return <CiaraAIAgentBuilderModal />;
      case "campaign_summary":
        return <CampaignSummaryModal />;
      default:
        return null;
    }
  };

  return renderModal();
};

export default CampaignCreationFlow;
