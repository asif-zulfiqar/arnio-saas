import { useRef, useState } from "react";
import useAccountStore from "../../../store/settings/useAccountStore";

const WorkspaceDetailsSection = () => {
  const logoInputRef = useRef(null);
  const [localChanges, setLocalChanges] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    companyLogo,
    companyName,
    billingCountry,
    workspaceHandle,
    updateWorkspaceDetails,
    toggleSaveChangesModal,
  } = useAccountStore();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateWorkspaceDetails("companyLogo", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    // Set companyLogo to null or empty string to remove the image
    updateWorkspaceDetails("companyLogo", null);
    // Also clear the file input
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleFieldChange = (field, value) => {
    setLocalChanges((prev) => ({ ...prev, [field]: value }));
    updateWorkspaceDetails(field, value);
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toggleSaveChangesModal("workspaceDetails");
    setIsLoading(false);
  };

  // Default avatar component
  const DefaultAvatar = () => (
    <div className="w-11 h-11 rounded bg-gray-900 flex items-center justify-center">
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xs border border-[#E5E7EB] p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-[#101828] mb-6">
        Workspace details
      </h3>

      {/* Company Logo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Company logo
        </label>
        <div className="flex items-center gap-4">
          <div className="relative mb-4">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company"
                className="w-11 h-11 rounded object-cover border border-gray-200"
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <div className="w-full">
            <div className="flex items-stretch  bg-gray-50 border border-[#E5E7EB] rounded-lg overflow-hidden flex-2">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="text-sm font-normal text-[#6A7282] bg-[#F3F4F6] hover:bg-gray-200 transition-colors px-3 py-2"
              >
                Choose files
              </button>
              <div className="w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 px-3 py-2">
                {companyLogo ? "Image selected" : "No file chosen"}
              </span>
            </div>
            <p className="mt-2 text-xs font-normal font-base text-[#4A5565]">
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Remove profile picture button - Only show when there's a profile picture */}
      {companyLogo && (
        <button
          onClick={handleRemoveProfilePicture}
          className="text-[12px] font-medium text-gray-900 w-[153px] h-[34px]   border p-2 border-gray-200 rounded-lg hover:bg-gray-50 mb-6 transition-colors"
        >
          Remove profile picture
        </button>
      )}

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm  font-medium text-[#111928] mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={localChanges.companyName ?? companyName}
              onChange={(e) => handleFieldChange("companyName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Billing Country */}
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-1">
              Billing country
            </label>
            <div className="relative">
              <select
                value={localChanges.billingCountry ?? billingCountry}
                onChange={(e) =>
                  handleFieldChange("billingCountry", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="United States of America">
                  United States of America
                </option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Handle */}
        <div>
          <label className="block text-sm font-medium text-[#111928] mb-1">
            Workspace handle
          </label>
          <input
            type="text"
            value={localChanges.workspaceHandle ?? workspaceHandle}
            onChange={(e) =>
              handleFieldChange("workspaceHandle", e.target.value)
            }
            placeholder="dashboard.amio.co/my-workspace"
            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setLocalChanges({})}
          disabled={isLoading}
          className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-2 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkspaceDetailsSection;
