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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-8 col-span-2  ">
            {/* Account Details */}
            <div>
              <AccountDetailsSection />
            </div>

            {/* Plan Section */}
            <div>
              <PlanSection />
            </div>

            {/* Workspace Details */}
            <div>
              <WorkspaceDetailsSection />
            </div>

            {/* Password Section */}
            <div>
              <PasswordSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-14 col-span-1">
            {/* Phone Lines */}
            <div>
              <PhoneLinesSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
