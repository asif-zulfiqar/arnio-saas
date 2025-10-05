import { useState, useRef } from "react";
import useAccountStore from "../../../store/settings/useAccountStore";

const AccountDetailsSection = () => {
  const fileInputRef = useRef(null);
  const [localChanges, setLocalChanges] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters except the + at the beginning
    let cleaned = value.replace(/[^\d+]/g, "");

    // Remove any existing +1 to avoid duplication
    cleaned = cleaned.replace(/^\+1/, "");

    // If empty after cleaning, return empty
    if (!cleaned) return "";

    // Format as US phone number: +1 (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const part1 = match[1];
      const part2 = match[2];
      const part3 = match[3];

      let formatted = "+1 ";
      if (part1) formatted += `(${part1}`;
      if (part2) formatted += `) ${part2}`;
      if (part3) formatted += `-${part3}`;

      return formatted;
    }

    return value;
  };

  const handlePhoneNumberChange = (value) => {
    const formattedNumber = formatPhoneNumber(value);
    handleFieldChange("phoneNumber", formattedNumber);
  };

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
    removeProfilePicture();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFieldChange = (field, value) => {
    setLocalChanges((prev) => ({ ...prev, [field]: value }));
    updateAccountDetails(field, value);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toggleSaveChangesModal("accountDetails");
    setIsLoading(false);
  };

  const handleCancel = () => {
    setLocalChanges({});
  };

  // Default avatar component
  const DefaultAvatar = () => (
    <div className="w-16 h-16 rounded-full px-[5px] py-[10px] bg-gray-200 flex items-center justify-center">
      <span className="text-xl font-semibold text-[#4A5565]">BG</span>
    </div>
  );

  // Get display value for phone number
  const displayPhoneNumber = localChanges.phoneNumber ?? phoneNumber;

  return (
    <div className="bg-white rounded-lg shadow-xs border border-[#E5E7EB] p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-[#101828] mb-6">
        Account details
      </h3>

      {/* Profile Picture */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#101828] mb-3">
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
            <div className="flex items-stretch bg-gray-50 border border-[#E5E7EB] rounded-lg overflow-hidden flex-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-normal text-[#6A7282] bg-[#F3F4F6] hover:bg-gray-200 transition-colors px-3 py-2"
              >
                Choose files
              </button>
              <div className="w-px bg-gray-300"></div>
              <span className="text-sm font-normal text-[#6A7282] px-3 py-2">
                {profilePicture ? "Image selected" : "No file chosen"}
              </span>
            </div>

            <p className="mt-2 text-xs font-normal font-base text-[#4A5565]">
              SVG, PNG, JPG or GIF (MAX. 800x400px).
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

      {/* Remove profile picture button */}
      {profilePicture && (
        <button
          onClick={handleRemoveProfilePicture}
          className="text-[12px] font-medium text-gray-900 w-[153px] h-[34px] border p-2 border-gray-200 rounded-lg hover:bg-gray-50 mb-6 transition-colors"
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
            className="w-full px-4 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* User Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User role
          </label>
          <div className="relative">
            <select
              value={localChanges.userRole ?? userRole}
              onChange={(e) => handleFieldChange("userRole", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 appearance-none pr-10"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
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

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g. +1 (443) 768-9947"
            value={displayPhoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            className="w-full px-4 py-2 border bg-gray-50 border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-3 py-2 text-xs font-medium font-inter text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-2 text-xs font-medium font-inter text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AccountDetailsSection;
