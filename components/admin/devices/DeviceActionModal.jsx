import React from "react";
import { X } from "lucide-react";

const DeviceActionModal = ({ openModal, onClose }) => {
  if (!openModal) return null;

  const isSuspend = openModal === "Suspend";

  const description = isSuspend
    ? "Are you sure you want to suspend this Device? Suspending this device will immediately stop all message activity, disable its API key, and pause webhook deliveries."
    : "Are you sure you want to reactivate this Device? Reactivating this device will restore its ability to send and receive messages and re-enable its API key and webhooks.";

  const primaryColor = isSuspend
    ? "bg-red-700 hover:bg-red-700"
    : "bg-blue-700 hover:bg-blue-700";

  const buttonText = isSuspend ? "Yes, I’m sure" : "Yes, I’m sure";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              {isSuspend ? "✕" : "✓"}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 text-center mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            No, cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm text-white ${primaryColor}`}
            onClick={() => {
              onClose();
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceActionModal;
