import React from "react";
import { X } from "lucide-react";

const CompanyStatusModal = ({ company, type, onClose }) => {
  const isSuspend = type === "suspend";
  const isReactivate = type === "reactivate";

  const title = isSuspend
    ? "Suspend Company"
    : isReactivate
    ? "Reactivate Company"
    : "Change Plan";

  const description = isSuspend
    ? "Suspending this company will temporarily disable all associated workspaces, users, and phone numbers. They won’t be able to send or receive messages until reactivated."
    : isReactivate
    ? "Reactivating this company will restore access for all associated workspaces, users, and phone numbers."
    : "Change this company’s current subscription plan below.";

  const primaryColor = isSuspend
    ? "bg-red-600 hover:bg-red-700"
    : isReactivate
    ? "bg-green-600 hover:bg-green-700"
    : "bg-blue-600 hover:bg-blue-700";

  const primaryText = isSuspend
    ? "Suspend"
    : isReactivate
    ? "Reactivate"
    : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          {description}
        </p>

        {/* Company Summary */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{company?.name}</h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                company.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {company.status}
            </span>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Plan</span>
              <span className="font-medium text-gray-900">{company.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Users</span>
              <span className="font-medium text-gray-900">{company.users}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lines</span>
              <span className="font-medium text-gray-900">{company.lines}</span>
            </div>
          </div>
        </div>

        {/* Reason input (only for suspend/reactivate) */}
        {(isSuspend || isReactivate) && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason (optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Payment issue, security review..."
              className="w-full border border-gray-300 rounded-lg text-sm p-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm text-white ${primaryColor}`}
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatusModal;
