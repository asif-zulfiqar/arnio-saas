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
        now.setFullYear(now.getFullYear() + parseInt(amount)); // Fixed line
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
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Development"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-900">
            Expiration date
          </label>
          <div className="flex items-center gap-2">
            {" "}
            {/* Added gap for better spacing */}
            <button
              type="button"
              onClick={handleToggleChange}
              className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                apiKeyForm.neverExpires ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  apiKeyForm.neverExpires ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">Never expires</span>
          </div>
        </div>

        {!apiKeyForm.neverExpires && (
          <div className="relative">
            {" "}
            {/* Added wrapper for custom dropdown */}
            <select
              value={apiKeyForm.expirationDate}
              onChange={(e) =>
                updateApiKeyForm("expirationDate", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 bg-gray-50" // Added appearance-none, pr-10, and bg-gray-50
            >
              <option value="7 days">7 days</option>
              <option value="30 days">30 days</option>
              <option value="3 months">3 months</option>
              <option value="1 year">1 year</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}

        {!apiKeyForm.neverExpires && getExpirationDate() && (
          <p className="text-[14px] text-gray-500 mt-2">
            The API will expire on{" "}
            <span className="align-middle text-gray-900 ">
              {getExpirationDate()}
            </span>
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200 my-4" />

      {/* Buttons positioned to bottom right */}
      <div className="flex justify-end gap-4 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

export default AddApiKeyModal;
