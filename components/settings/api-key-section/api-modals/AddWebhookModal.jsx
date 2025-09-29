import useApiSettingsStore from "../../../../store/settings/apiSettingsStore";

const AddWebhookModal = ({ onClose }) => {
  const { webhookForm, updateWebhookForm, createWebhook } =
    useApiSettingsStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    createWebhook();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Webhook Name
        </label>
        <input
          type="text"
          value={webhookForm.name}
          onChange={(e) => updateWebhookForm("name", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter webhook name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target URL
        </label>
        <input
          type="url"
          value={webhookForm.targetUrl}
          onChange={(e) => updateWebhookForm("targetUrl", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/webhook"
        />
      </div>

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
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddWebhookModal;
