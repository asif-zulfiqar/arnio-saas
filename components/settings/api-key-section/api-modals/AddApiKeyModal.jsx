import useApiSettingsStore from "../../../../store/settings/apiSettingsStore";

const AddApiKeyModal = ({ onClose }) => {
  const { apiKeyForm, updateApiKeyForm, createApiKey } = useApiSettingsStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    createApiKey();
  };

  // Calculate expiration date
  const getExpirationDate = () => {
    if (apiKeyForm.neverExpires) return null;

    const now = new Date();
    const [amount, unit] = apiKeyForm.expirationDate.split(" ");

    switch (unit) {
      case "days":
        now.setDate(now.getDate() + parseInt(amount));
        break;
      case "months":
        now.setMonth(now.getMonth() + parseInt(amount));
        break;
      case "year":
        now.setFullYear(now.getYear() + parseInt(amount));
        break;
    }

    return now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleToggleChange = () => {
    updateApiKeyForm("neverExpires", !apiKeyForm.neverExpires);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informational text */}
      <p className="text-sm text-gray-600">
        API keys allow you to make API calls for your own account.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name this key
        </label>
        <input
          type="text"
          value={apiKeyForm.name}
          onChange={(e) => updateApiKeyForm("name", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Development"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Expiration date
          </label>
          <div className="flex items-center ">
            <button
              type="button"
              onClick={handleToggleChange}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none mr-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                apiKeyForm.neverExpires ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  apiKeyForm.neverExpires ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700 ">Never expires</span>
          </div>
        </div>

        {!apiKeyForm.neverExpires && (
          <select
            value={apiKeyForm.expirationDate}
            onChange={(e) => updateApiKeyForm("expirationDate", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7 days">7 days</option>
            <option value="30 days">30 days</option>
            <option value="3 months">3 months</option>
            <option value="1 year">1 year</option>
          </select>
        )}

        {!apiKeyForm.neverExpires && getExpirationDate() && (
          <p className="text-sm text-gray-500 mt-2">
            The API will expire on {getExpirationDate()}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200 my-4" />

      {/* Buttons positioned to bottom right */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddApiKeyModal;
