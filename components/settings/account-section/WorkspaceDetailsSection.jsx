import { useRef, useState } from "react";
import useAccountStore from "../../../store/settings/useAccountStore";

const WorkspaceDetailsSection = () => {
  const logoInputRef = useRef(null);
  const [localChanges, setLocalChanges] = useState({});

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

  const handleSave = () => {
    toggleSaveChangesModal("workspaceDetails");
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
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
            <div className="flex items-stretch bg-gray-50 border border-gray-300 rounded-lg overflow-hidden flex-2">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-2"
              >
                Choose files
              </button>
              <div className="w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 px-3 py-2">
                {companyLogo ? "Image selected" : "No file chosen"}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
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
          className="text-sm border p-2 border-gray-300 rounded-lg hover:bg-gray-50 mb-6 transition-colors"
        >
          Remove profile picture
        </button>
      )}

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={localChanges.companyName ?? companyName}
              onChange={(e) => handleFieldChange("companyName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Billing Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing country
            </label>
            <select
              value={localChanges.billingCountry ?? billingCountry}
              onChange={(e) =>
                handleFieldChange("billingCountry", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="United States of America">
                United States of America
              </option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>

        {/* Workspace Handle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workspace handle
          </label>
          <input
            type="text"
            value={localChanges.workspaceHandle ?? workspaceHandle}
            onChange={(e) =>
              handleFieldChange("workspaceHandle", e.target.value)
            }
            placeholder="dashboard.amio.co/my-workspace"
            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setLocalChanges({})}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WorkspaceDetailsSection;
