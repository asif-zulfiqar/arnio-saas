import React, { useState, useEffect, useRef, useCallback } from "react";
import useCampaignStore from "@/store/campaigns/campaignStore";
import EmptyCampaignState from "./EmptyCampaignState";
import CampaignCard from "./CampaignCard";
import CampaignCreationFlow from "./CampaignCreationFlow";
import { Plus, Search } from "lucide-react";

const CampaignList = () => {
  const {
    campaigns = [],
    campaignsLoading = false,
    campaignsPagination = {},
    searchQuery = "",
    loadCampaigns,
    searchCampaigns,
    loadMoreCampaigns,
    openCreateCampaignModal,
  } = useCampaignStore();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef();

  // Safe access to pagination properties
  const { hasMore = false, page = 1, pages = 0 } = campaignsPagination;

  // Initial load
  useEffect(() => {
    const fetchCampaigns = async () => {
      await loadCampaigns();
      setIsInitialLoad(false);
    };

    fetchCampaigns();
  }, [loadCampaigns]);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        searchCampaigns(localSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, searchCampaigns]);

  // Infinite scroll observer
  const lastCampaignElementRef = useCallback(
    (node) => {
      if (campaignsLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCampaigns();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [campaignsLoading, hasMore, loadMoreCampaigns]
  );

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const hasNoCampaigns = campaigns.length === 0 && !campaignsLoading;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-[39px] mt-1">
        <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>
        <div className="flex items-center gap-4 mr-0.5">
          <button
            onClick={openCreateCampaignModal}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Loading State for Initial Load */}
      {isInitialLoad && campaignsLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Campaign List or Empty State */}
      {hasNoCampaigns && !campaignsLoading ? (
        <EmptyCampaignState isCreditsEmpty={false} />
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign, index) => {
            // Attach observer to last campaign card for infinite scroll
            if (campaigns.length === index + 1) {
              return (
                <div key={campaign.id} ref={lastCampaignElementRef}>
                  <CampaignCard campaign={campaign} />
                </div>
              );
            }
            return <CampaignCard key={campaign.id} campaign={campaign} />;
          })}
        </div>
      )}

      {/* Loading More Indicator */}
      {campaignsLoading && !isInitialLoad && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No More Results */}
      {!hasMore && campaigns.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more campaigns to load
        </div>
      )}

      {/* No Results for Search */}
      {campaigns.length === 0 && !campaignsLoading && localSearchQuery && (
        <div className="text-center py-8 text-gray-500">
          No campaigns found for "{localSearchQuery}"
        </div>
      )}

      {/* Unified Campaign Creation Flow */}
      <CampaignCreationFlow />
    </div>
  );
};

export default CampaignList;
