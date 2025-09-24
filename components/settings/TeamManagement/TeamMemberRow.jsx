import React, { useState } from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import Image from "next/image";

const TeamMemberRow = ({ member }) => {
  const {
    deleteTeamMember,
    updateTeamMember,
    setEditingMember,
    toggleDeleteModal,
    setDeletingMember,
  } = useSettingsStore();
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = ["Admin", "Manager", "User"];

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

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    updateTeamMember(member.id, { role });
    setShowRoleDropdown(false);
  };

  const handleDelete = () => {
    setDeletingMember(member);
    toggleDeleteModal();
  };

  const handleEdit = () => {
    setEditingMember(member);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <tr className="hover:bg-gray-50">
      {/* User Column */}
      <td className="px-8 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {member.avatar ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={member.avatar}
              alt={member.name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {member.initials || getInitials(member.name)}
            </div>
          )}
          <span className="text-sm font-medium text-gray-900">
            {member.name}
          </span>
        </div>
      </td>

      {/* Email Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">{member.email}</span>
      </td>

      {/* Role Column */}
      <td className="px-6 py-4 whitespace-nowrap relative">
        <button
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {/* Use imported SVG with Image component */}
          <Image
            src={getRoleLogo(member.role)}
            alt={`${member.role} role`}
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          {member.role}
          <svg
            className="w-4 h-4"
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
        </button>

        {/* Role Dropdown - Clean Design without Radio Buttons */}
        {showRoleDropdown && (
          <div className="absolute z-50 mt-2 w-40 bg-white rounded-md shadow-md border border-gray-200">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                  selectedRole === role ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
              >
                {/* Use imported SVG with Image component */}
                <Image
                  src={getRoleLogo(role)}
                  alt={`${role} role`}
                  width={16}
                  height={16}
                  className="flex-shrink-0"
                />
                <span className="text-gray-700">{role}</span>
              </button>
            ))}
          </div>
        )}
      </td>

      {/* Actions Column */}
      <td className="px-8 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            {/* Fixed SVG with camelCase attributes */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center gap-1"
          >
            {/* Fixed SVG with camelCase attributes */}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeamMemberRow;
