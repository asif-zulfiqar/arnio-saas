import React, { useState } from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import Image from "next/image";

const AddTeamMemberModal = ({ onClose }) => {
  const { addTeamMember } = useSettingsStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Get the appropriate logo for each role
  const getRoleLogo = (role) => {
    switch (role) {
      case "Admin":
        return "/svgs/adminlogo.svg";
      case "Manager":
        return "/svgs/managerlogo.svg";
      case "User":
        return "/svgs/userlogo.svg";
      default:
        return "/svgs/userlogo.svg";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
    setShowRoleDropdown(false);
    // Clear role error if any
    if (errors.role) {
      setErrors((prev) => ({
        ...prev,
        role: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Role selection is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get initials from name
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // Just call addTeamMember - it automatically closes the modal
    addTeamMember({
      ...formData,
      initials,
      avatar: null,
    });
  };

  const roles = ["Admin", "Manager", "User"];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-50 focus:ring-1 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-50 focus:ring-1 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g. jane.doe@gmail.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Role Field - Custom Dropdown with Icons */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          User Role
        </label>
        <div className="relative">
          {/* Role Dropdown Button */}
          <button
            type="button"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`w-full  pr-10 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-gray-50 text-left flex items-center ${
              errors.role ? "border-red-500" : "border-gray-300"
            } ${
              !formData.role ? "text-gray-400 " : "text-gray-900 pl-3  gap-3"
            }`}
          >
            {/* Role Icon (only show if role is selected) */}
            {formData.role ? (
              <Image
                src={getRoleLogo(formData.role)}
                alt={`${formData.role} role`}
                width={16}
                height={16}
                className="flex-shrink-0 opacity-60"
              />
            ) : (
              <div className="w-4 h-4 flex-shrink-0"></div> // Spacer when no role selected
            )}

            {/* Role Name or Placeholder */}
            <span>{formData.role || "Select..."}</span>

            {/* Dropdown Arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
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
          </button>

          {/* Role Dropdown Options */}
          {showRoleDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                    formData.role === role
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {/* Role Icon */}
                  <Image
                    src={getRoleLogo(role)}
                    alt={`${role} role`}
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  {/* Role Name */}
                  <span>{role}</span>

                  {/* Checkmark for selected role */}
                  {formData.role === role && (
                    <svg
                      className="w-4 h-4 ml-auto text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      <div class="w-full h-px bg-gray-300 my-3 mt-9"></div>

      {/* Action Buttons */}
      <div className="flex gap-60 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>

      {/* Close dropdown when clicking outside */}
      {showRoleDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRoleDropdown(false)}
        />
      )}
    </form>
  );
};

export default AddTeamMemberModal;
