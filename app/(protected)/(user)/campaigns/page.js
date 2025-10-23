"use client";
import React, { useState } from "react";
import CampaignList from "@/components/campaigns/all-compaigns/CampaignList";
import FaqList from "@/components/campaigns/faq/FaqList";

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState("campaigns");

  const tabs = [
    { id: "campaigns", label: "Campaigns" },
    { id: "faq-list", label: "FAQ List" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "campaigns":
        return <CampaignList />;

      case "faq-list":
        return <FaqList />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="pb-8 pt-1">
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        </div>

        {/* Tabs */}
        <div className="">
          <nav className="flex space-x-6 border-b w-55 border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto mt-[35px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
