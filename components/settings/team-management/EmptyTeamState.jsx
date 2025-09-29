import React from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import AddTeamMemberModal from "./AddTeamMemberModal";

const EmptyTeamState = () => {
  const { showAddMemberModal } = useSettingsStore();

  return (
    <>
      <div className="bg-white h-full flex flex-col items-center justify-center px-8">
        {/* Icon */}
        <div className="w-20 h-20 mb-6 flex items-center justify-center bg-gray-100 rounded-full">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <p className="text-gray-500 text-base">There is no team members yet</p>
      </div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && <AddTeamMemberModal />}
    </>
  );
};

export default EmptyTeamState;
