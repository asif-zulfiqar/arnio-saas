import React from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import PhoneLinesSection from "./PhoneLinesSection";
import PlanSection from "./PlanSection";
import WorkspaceDetailsSection from "./WorkspaceDetailsSection";
import PasswordSection from "./PasswordSection";

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <AccountDetailsSection />
            </div>

            {/* Plan Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <PlanSection />
            </div>

            {/* Workspace Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <WorkspaceDetailsSection />
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <PasswordSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-14">
            {/* Phone Lines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <PhoneLinesSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
