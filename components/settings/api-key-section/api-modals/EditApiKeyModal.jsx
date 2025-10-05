import useApiSettingsStore from "../../../../store/settings/apiSettingsStore";

const EditApiKeyModal = ({ onClose }) => {
  const { selectedApiKey, apiKeyForm, updateApiKeyForm, updateApiKey } =
    useApiSettingsStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateApiKey();
  };

  if (!selectedApiKey) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informational text */}
      <p className="text-sm text-gray-500">
        API keys allow you to make API calls for your own account.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Name this key
        </label>
        <input
          type="text"
          value={apiKeyForm.name}
          onChange={(e) => updateApiKeyForm("name", e.target.value)}
          className="w-full border border-gray-300 text-gray-900 text-sm font-normal bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter API key name"
        />
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200 " />

      {/* Buttons positioned to bottom right */}
      <div className="flex justify-end gap-4 ">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditApiKeyModal;
