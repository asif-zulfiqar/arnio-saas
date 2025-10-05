import React, { useState } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";

const PasswordComponent = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // States for password visibility - default to false (hidden)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic password validation based on actual input
  const hasMinLength = newPassword.length >= 10;
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isDifferentFromPrevious =
    newPassword !== currentPassword && currentPassword !== "";

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Current password validation
    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    // New password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (
      !hasMinLength ||
      !hasLowercase ||
      !hasSpecialChar ||
      !isDifferentFromPrevious
    ) {
      newErrors.newPassword = "Please meet all password requirements";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Password updated successfully");
    // Handle actual password update logic here

    // Reset form on success
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });

    setIsLoading(false);
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    switch (field) {
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border border-[#E5E7EB] p-6 h-full flex flex-col mb-4">
      <h2 className="text-xl text-[#101828] font-semibold mb-6">Password</h2>

      <div className="flex gap-4">
        {/* Left side - Input fields */}
        <div className="flex-3 space-y-4">
          {/* Current Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Enter your current password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="Enter your current password"
                className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                  errors.currentPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showCurrentPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your new password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Enter your new password"
                className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                  errors.newPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showNewPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm new password"
                className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Password requirements */}
        <div className="flex-4">
          <div className="mb-6 bg-gray-50 p-4 rounded-xl">
            <h3 className="block text-sm font-medium text-gray-900 mb-2">
              Password requirements:
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Ensure that these requirements are met:
            </p>

            {/* Requirement Block Container */}
            <div className="space-y-2 ml-4 opacity-80 mx-auto my-auto">
              {/* Requirement 1 */}
              <div className="flex items-center gap-[6px]">
                <div className="flex-shrink-0">
                  {hasMinLength ? (
                    <div className="w-3 h-3 rounded-full bg-[#0E9F6E] flex items-center justify-center">
                      <Check
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center">
                      <X
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  )}
                </div>
                <span className="text-gray-500 font-inter font-normal text-[12px]">
                  At least 10 characters (and up to 100 characters)
                </span>
              </div>

              {/* Requirement 2 */}
              <div className="flex items-center gap-[6px]">
                <div className="flex-shrink-0">
                  {hasLowercase ? (
                    <div className="w-3 h-3 rounded-full bg-[#0E9F6E] flex items-center justify-center">
                      <Check
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center">
                      <X
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  )}
                </div>
                <span className="text-gray-500 font-inter font-normal text-[12px]">
                  At least one lowercase character
                </span>
              </div>

              {/* Requirement 3 */}
              <div className="flex items-center gap-[6px]">
                <div className="flex-shrink-0">
                  {hasSpecialChar ? (
                    <div className="w-3 h-3 rounded-full bg-[#0E9F6E] flex items-center justify-center">
                      <Check
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center">
                      <X
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  )}
                </div>
                <span className="text-gray-500 font-inter font-normal text-[12px]">
                  Inclusion of at least one special character, e.g., ! @ # ?
                </span>
              </div>

              {/* Requirement 4 */}
              <div className="flex items-center gap-[6px]">
                <div className="flex-shrink-0">
                  {isDifferentFromPrevious ? (
                    <div className="w-3 h-3 rounded-full bg-[#0E9F6E] flex items-center justify-center">
                      <Check className="w-1 h-1 text-white" strokeWidth={7} />
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center">
                      <X
                        className="w-[6px] h-[6px] text-white"
                        strokeWidth={4}
                      />
                    </div>
                  )}
                </div>
                <span className="text-gray-500 font-inter font-normal text-[12px]">
                  Significantly different from your previous passwords
                </span>
              </div>
            </div>
          </div>

          {/* Buttons aligned to the right */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-medium text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
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
      </div>
    </div>
  );
};

export default PasswordComponent;
