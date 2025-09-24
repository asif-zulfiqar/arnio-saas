import React from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import { Trash2 } from "lucide-react";

const DeleteConfirmationModal = ({ onClose }) => {
  const { deletingMember, deleteTeamMember } = useSettingsStore();

  const handleConfirmDelete = () => {
    // Just call deleteTeamMember - it automatically closes the modal
    deleteTeamMember(deletingMember.id);
    // REMOVED: onClose() - store already handles this
  };

  if (!deletingMember) return null;

  return (
    <div className="space-y-4">
      {/* Trash Icon */}
      <div className="flex justify-center mb-4">
        <Trash2 className="text-gray-400 w-6 h-6" strokeWidth={3} />
      </div>

      {/* Message */}
      <div className="text-center mb-6">
        <p className="text-gray-700">
          Are you sure you want to delete this Team Member?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 px-9">
        <button
          onClick={onClose}
          className="flex-1 px-4  py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          No, cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Yes, I'm sure
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
