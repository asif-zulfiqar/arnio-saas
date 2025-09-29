import React, { useState } from "react";
import { Check, X } from "lucide-react";

const PasswordComponent = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password validation - Set to match the image state
  const hasMinLength = true; // First requirement is met (green check)
  const hasLowercase = true; // Second requirement is met (green check)
  const hasSpecialChar = false; // Third requirement is not met (grey circle)
  const isDifferentFromPrevious = false; // Fourth requirement is not met (grey circle)

  const handleSaveChanges = () => {
    if (
      hasMinLength &&
      hasLowercase &&
      hasSpecialChar &&
      isDifferentFromPrevious &&
      newPassword === confirmPassword
    ) {
      console.log("Password updated successfully");
      // Handle password update logic here
    } else {
      console.log("Please meet all password requirements");
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Password</h2>

      <div className="flex gap-8">
        {/* Left side - Input fields */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your new password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Password requirements */}
        <div className="flex-1 pl-0">
          <div className="mb-6 bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Password requirements:
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ensure that these requirements are met:
            </p>

            <div className="space-y-3">
              {/* Requirement 1 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {hasMinLength ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3  text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  At least 10 characters (and up to 100 characters)
                </span>
              </div>

              {/* Requirement 2 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {hasLowercase ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  At least one lowercase character
                </span>
              </div>

              {/* Requirement 3 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {hasSpecialChar ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                      <X className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    hasSpecialChar ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Inclusion of at least one special character, e.g., ! @ # ?
                </span>
              </div>

              {/* Requirement 4 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isDifferentFromPrevious ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                      <X className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isDifferentFromPrevious ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Significantly different from your previous passwords
                </span>
              </div>
            </div>
          </div>

          {/* Buttons aligned to the right */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordComponent;
