import React from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import AddTeamMemberModal from "./AddTeamMemberModal";
import Image from "next/image";

const EmptyTeamState = () => {
  const { showAddMemberModal } = useSettingsStore();

  return (
    <>
      <div className="bg-white flex flex-col items-center justify-center px-8 py-[153px]  ">
        {/* Icon */}
        <div className="w-15 h-15 mb-6 flex items-center justify-center bg-gray-100 rounded-full">
          <Image
            src="/svgs/settings/emptyteamicon.svg"
            alt="Empty team"
            width={35}
            height={35}
            className="text-[#4A5565]"
          />
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
