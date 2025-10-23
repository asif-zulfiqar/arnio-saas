import React from "react";
import Modal from "@/components/global/Modal";

const CreditsModal = ({ credits, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Credits</h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Instantly Credits
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {credits}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${credits}%` }}
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Upgrade & Change Limits
        </button>
      </div>
    </Modal>
  );
};

export default CreditsModal;
