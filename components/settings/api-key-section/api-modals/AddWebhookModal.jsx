import useApiSettingsStore from "../../../../store/settings/apiSettingsStore";

const AddWebhookModal = ({ onClose }) => {
  const { webhookForm, updateWebhookForm, createWebhook } =
    useApiSettingsStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    createWebhook();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Target URL
        </label>
        <input
          type="url"
          value={webhookForm.targetUrl}
          onChange={(e) => updateWebhookForm("targetUrl", e.target.value)}
          className="w-full border border-gray-300 rounded-lg bg-gray-50 text-[14px] font-inter px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/webhook"
        />
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200 my-5" />

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

export default AddWebhookModal;
