// DeletePhoneLineModal.tsx
import React from "react";
import useAccountStore from "../../../store/settings/useAccountStore";
import { Trash2 } from "lucide-react";

const DeletePhoneLineModal = ({ onClose }) => {
  const { phoneToDelete, deletePhoneLine } = useAccountStore();

  const handleConfirmDelete = () => {
    deletePhoneLine();
  };

  if (!phoneToDelete) return null;

  return (
    <div className="space-y-4">
      {/* Trash Icon - Centered */}
      <div className="flex justify-center mb-4">
        <div className="flex justify-center mb-4">
          <Trash2 className="text-gray-400 w-6 h-6" strokeWidth={3} />
        </div>
      </div>

      {/* Message */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Are you sure you want to delete this Line?
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          No, cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
        >
          Yes, I'm sure
        </button>
      </div>
    </div>
  );
};

export default DeletePhoneLineModal;
