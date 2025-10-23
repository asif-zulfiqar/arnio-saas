// utils/campaignToast.js
import toast from "react-hot-toast";
import CampaignToast from "@/components/global/CampaignToast";

const campaignToaster = {
  success: (
    title = "Campaign created",
    message = "You can review or edit it anytime from the Campaigns tab."
  ) => {
    return toast.custom(
      (t) => (
        <CampaignToast
          t={t} // Changed from 'toast' to 't'
          title={title}
          message={message}
        />
      ),
      {
        duration: 5000,
        position: "bottom-right",
      }
    );
  },

  update: (
    title = "Campaign updated",
    message = "Your changes have been saved successfully."
  ) => {
    return toast.custom(
      (t) => (
        <CampaignToast
          t={t} // Changed from 'toast' to 't'
          title={title}
          message={message}
        />
      ),
      {
        duration: 5000,
        position: "bottom-right",
      }
    );
  },

  draft: (
    title = "Draft saved",
    message = "Your campaign has been saved as draft."
  ) => {
    return toast.custom(
      (t) => (
        <CampaignToast
          t={t} // Changed from 'toast' to 't'
          title={title}
          message={message}
        />
      ),
      {
        duration: 5000,
        position: "bottom-right",
      }
    );
  },
};

export default campaignToaster;
