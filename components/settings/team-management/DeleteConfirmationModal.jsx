import React from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import Image from "next/image";

const DeleteConfirmationModal = ({ onClose }) => {
  const { deletingMember, deleteTeamMember } = useSettingsStore();

  const handleConfirmDelete = () => {
    // Just call deleteTeamMember - it automatically closes the modal
    deleteTeamMember(deletingMember.id);
    // REMOVED: onClose() - store already handles this
  };

  if (!deletingMember) return null;

  return (
    <div className="spcace-y-6">
      {/* Trash Icon */}
      <div className="flex justify-center mb-4">
        <Image
          src="/svgs/settings/deletemodalicon.svg"
          alt="Delete"
          width={24}
          height={24}
        />
      </div>

      {/* Message */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-[16px]  font-inter font-normal font-inter line-height-[150%] ">
          Are you sure you want to delete this Team Member?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[16px] px-20">
        <button
          onClick={onClose}
          className="flex-1 px-[12px] py-[8px] border border-gray-200 text-gray-900 font-inter text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          No, cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="flex-1  px-[12px] py-[8px] bg-red-700 text-white font-inter text-[14px] font-medium rounded-lg hover:bg-red-500 transition-colors"
        >
          Yes, I'm sure
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
