import { useState } from "react";
import useApiSettingsStore from "../../../../store/settings/apiSettingsStore";
import { ClipboardList, Check } from "lucide-react";

const ApiKeySuccessModal = ({ onClose }) => {
  const { newApiKey } = useApiSettingsStore();
  const [copied, setCopied] = useState(false);

  if (!newApiKey) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(newApiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-900">
        <span className="font-medium">Save this API key somewhere safe.</span>{" "}
        You will not be able to view it again once you close this modal.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <div className="flex items-center justify-between">
          <code className="text-xs text-gray-700 break-all flex-1">
            {newApiKey.key}
          </code>
          <button
            onClick={handleCopyKey}
            className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <ClipboardList className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Expires {newApiKey.expirationDate}
      </p>

      {/* Divider */}
      <hr className="border-t border-gray-200 my-4" />

      {/* Buttons positioned to bottom right */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCopyKey}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy Key"}
        </button>
      </div>
    </div>
  );
};

export default ApiKeySuccessModal;
