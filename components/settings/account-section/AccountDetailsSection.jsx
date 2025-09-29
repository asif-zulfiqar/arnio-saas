import { useState, useRef } from "react";
import useAccountStore from "../../../store/settings/useAccountStore";

const AccountDetailsSection = () => {
  const fileInputRef = useRef(null);
  const [localChanges, setLocalChanges] = useState({});

  const {
    profilePicture,
    fullName,
    email,
    userRole,
    phoneNumber,
    updateAccountDetails,
    setProfilePicture,
    removeProfilePicture,
    toggleSaveChangesModal,
    hasUnsavedChanges,
  } = useAccountStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    // Remove the profile picture using the store function
    removeProfilePicture();
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFieldChange = (field, value) => {
    setLocalChanges((prev) => ({ ...prev, [field]: value }));
    updateAccountDetails(field, value);
  };

  const handleSave = () => {
    toggleSaveChangesModal("accountDetails");
  };

  const handleCancel = () => {
    setLocalChanges({});
    // Reset to original values
  };

  // Default avatar component
  const DefaultAvatar = () => (
    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-xl font-semibold text-gray-600">BG</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Account details
      </h3>

      {/* Profile Picture */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload profile picture
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <div className="w-full">
            <div className="flex items-stretch bg-gray-50 border border-gray-300 rounded-lg overflow-hidden flex-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-2"
              >
                Choose files
              </button>
              <div className="w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 px-3 py-2">
                {profilePicture ? "Image selected" : "No file chosen"}
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 800×400px).
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Remove profile picture button - Only show when there's a profile picture */}
      {profilePicture && (
        <button
          onClick={handleRemoveProfilePicture}
          className="text-sm border p-2 border-gray-300 rounded-lg hover:bg-gray-50 mb-6 transition-colors"
        >
          Remove profile picture
        </button>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full name
          </label>
          <input
            type="text"
            value={localChanges.fullName ?? fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            type="email"
            value={localChanges.email ?? email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* User Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User role
          </label>
          <select
            value={localChanges.userRole ?? userRole}
            onChange={(e) => handleFieldChange("userRole", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Member">Member</option>
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. +(12)3456 789"
            value={localChanges.phoneNumber ?? phoneNumber}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
            className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountDetailsSection;
