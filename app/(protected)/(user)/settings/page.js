"use client";

import AccountPage from "@/components/settings/account-section/AccountSection";
import TeamManagement from "../../../../components/settings/team-management/TeamManagement";
import useSettingsStore from "../../../../store/settings/settingsStore";
import AppStore from "@/components/settings/app-store-integration/AppStore";

import ApiSettingsPage from "@/components/settings/api-key-section/ApiSettings";
import UsageSection from "@/components/settings/usage-section/UsageSection";

const Settings = () => {
  const { activeTab, setActiveTab } = useSettingsStore();

  const tabs = [
    { id: "team-management", label: "Team Management" },
    { id: "app-store", label: "App Store" },
    { id: "account", label: "Account" },
    { id: "usage", label: "Usage" },
    { id: "api-settings", label: "API Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "team-management":
        return <TeamManagement />;
      case "app-store":
        return <AppStore />;
      case "account":
        return <AccountPage />;
      case "usage":
        return <UsageSection />;
      case "api-settings":
        return <ApiSettingsPage />;
      default:
        return <TeamManagement />;
    }
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header - directly on gray background */}
        <div className=" pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        {/* Tabs - directly on gray background with bottom border */}
        <div className="">
          <nav className="flex space-x-6 border-b border-gray-200 ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors relative  ${
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
        <div className="flex-1 overflow-y-auto mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
