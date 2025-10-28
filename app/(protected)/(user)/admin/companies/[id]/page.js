"use client";

import React, { useState } from "react";
import UsersTab from "@/components/admin/companies/companyTabs/UserTab";
import ApiWebhooksTab from "@/components/admin/companies/companyTabs/ApiWebhookTab";
import PhoneNumbersTab from "@/components/admin/companies/companyTabs/PhoneNumberTabs";
import BillingTab from "@/components/admin/companies/companyTabs/BillingTab";

const CompanyDetailsTabs = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users" },
    { id: "phoneNumbers", label: "Phone Numbers" },
    { id: "api", label: "API & Webhooks" },
    { id: "billing", label: "Billing" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div
        className="mx-auto flex-1 overflow-y-auto h-full
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style]:none
        [scrollbar-width]:none"
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Meadowfield
        </h1>

        <div>
          {/* Tabs Header */}
          <div className="inline-flex border-b border-gray-200 gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
        relative px-4 py-3 text-sm font-medium transition-colors
        ${
          activeTab === tab.id
            ? "text-[#1447E6]"
            : "text-gray-500 hover:text-gray-700"
        }
      `}
              >
                {tab.label}
                {/* Active blue underline */}
                {activeTab === tab.id && (
                  <span className="absolute left-0 bottom-[-1px] h-[2px] w-full bg-[#1447E6] rounded-t"></span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === "users" && <UsersTab />}
            {activeTab === "phoneNumbers" && <PhoneNumbersTab />}
            {activeTab === "api" && <ApiWebhooksTab />}
            {activeTab === "billing" && <BillingTab />}
            {/* {activeTab === "audit" && <AuditTab />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsTabs;
