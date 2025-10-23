import React, { useState, useEffect } from "react";
import { Edit, Pause, Play, Trash2, Info } from "lucide-react";
import useCampaignStore from "@/store/campaigns/campaignStore";
import CampaignDeleteModal from "./modals/CampaignDeleteModal";

const CampaignCard = ({ campaign }) => {
  const {
    startCampaign,
    pauseCampaign,
    deleteCampaign,
    openEditCampaignModal,
    getCampaignAnalytics,
    campaignsLoading,
  } = useCampaignStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Fetch analytics when campaign card is rendered
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (campaign?.id) {
        setIsLoadingAnalytics(true);
        try {
          const result = await getCampaignAnalytics(campaign.id);
          if (result.success) {
            setAnalytics(result.data);
          }
        } catch (error) {
          console.error("Failed to load analytics:", error);
        } finally {
          setIsLoadingAnalytics(false);
        }
      }
    };

    fetchAnalytics();
  }, [campaign?.id, getCampaignAnalytics]);

  if (!campaign) {
    return null;
  }

  // Helper function to calculate progress based on phone numbers
  const calculateProgress = () => {
    const totalContacts = campaign.phoneNumbers?.length || 0;
    const sentContacts = Math.min(totalContacts, campaign.perNumberRate || 0);
    return totalContacts > 0
      ? Math.round((sentContacts / totalContacts) * 100)
      : 0;
  };

  // Helper function to get current contacts count
  const getCurrentContacts = () => {
    return Math.min(
      campaign.phoneNumbers?.length || 0,
      campaign.perNumberRate || 0
    );
  };

  // Helper function to get daily capacity
  const getDailyCapacity = () => {
    return campaign.perNumberRate || 50;
  };

  // Helper function to format last modified date
  const getLastModified = () => {
    if (campaign.updatedAt) {
      const date = new Date(campaign.updatedAt);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    }
    return "Recently";
  };

  // Helper function to format metrics
  const formatMetric = (value, type = "percentage") => {
    if (value === null || value === undefined) return "--";

    if (type === "percentage") {
      return `${value}%`;
    } else if (type === "currency") {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active:
        "bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-lg",
      inactive:
        "bg-gray-100 text-gray-900 text-xs font-medium px-2.5 py-0.5 rounded-lg",
      draft:
        "bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-lg",
      scheduled:
        "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-lg",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status] || styles.draft
        }`}
      >
        {status}
      </span>
    );
  };

  const handleEditClick = () => {
    openEditCampaignModal(campaign.id);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCampaign(campaign.id);
      if (result.success) {
        setShowDeleteModal(false);
      } else {
        console.error("Failed to delete campaign:", result.error);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsTogglingStatus(true);
    try {
      if (campaign.status === "active") {
        const result = await pauseCampaign(campaign.id);
        if (!result.success) {
          console.error("Failed to pause campaign:", result.error);
        }
      } else {
        const result = await startCampaign(campaign.id);
        if (!result.success) {
          console.error("Failed to start campaign:", result.error);
        }
      }
    } catch (error) {
      console.error("Error toggling campaign status:", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const progress = calculateProgress();
  const currentContacts = getCurrentContacts();
  const dailyCapacity = getDailyCapacity();
  const lastModified = getLastModified();

  // Get analytics data
  const kpis = analytics?.analytics?.kpis || {};
  const metrics = analytics?.analytics?.metrics || {};

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-4">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-5 mb-[14px]">
              <h3 className="text-xl font-semibold text-gray-900">
                {campaign.name || "Unnamed Campaign"}
              </h3>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-lg font-normal text-gray-500">
              {campaign.description || "No description"}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleEditClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={campaignsLoading}
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleStatusToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={
                campaign.status === "scheduled" ||
                campaignsLoading ||
                isTogglingStatus
              }
            >
              {isTogglingStatus ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : campaign.status === "active" ? (
                <Pause className="w-4 h-4 text-gray-600" />
              ) : (
                <Play className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={campaignsLoading}
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-[77.67px] text-sm">
          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Progress
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[98px]">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress * 98) / 100}px` }}
                />
              </div>
              <span className="font-semibold text-gray-900 text-base">
                {progress}%
              </span>
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Contacts
            </div>
            <div className="font-semibold text-gray-900 flex items-center gap-1 relative text-base">
              {currentContacts}/{dailyCapacity} daily
              <div
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                {showTooltip && (
                  <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
                    Daily contact limit for this campaign
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Reply Rate
            </div>
            <div className="font-semibold text-gray-900 text-base">
              {isLoadingAnalytics ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
              ) : (
                formatMetric(kpis.replyRate, "percentage")
              )}
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Click Through Rate
            </div>
            <div className="font-semibold text-gray-900 text-base">
              {isLoadingAnalytics ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
              ) : (
                formatMetric(kpis.clickThroughRate, "percentage")
              )}
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Conversion Rate
            </div>
            <div className="font-semibold text-gray-900 text-base">
              {isLoadingAnalytics ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
              ) : (
                formatMetric(kpis.conversionRate, "percentage")
              )}
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Revenue Driven
            </div>
            <div className="font-semibold text-gray-900 text-base">
              {isLoadingAnalytics ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
              ) : (
                formatMetric(kpis.revenue, "currency")
              )}
            </div>
          </div>

          <div>
            <div className="text-base font-normal text-[#4A5565] mb-1">
              Last Modified
            </div>
            <div className="font-semibold text-gray-900 text-base">
              {lastModified}
            </div>
          </div>
        </div>
      </div>

      <CampaignDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        campaignName={campaign.name}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default CampaignCard;
