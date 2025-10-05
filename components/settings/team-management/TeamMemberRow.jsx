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
      <td className="px-[16px] py-[10px] whitespace-nowrap">
        <div className="flex items-center gap-3">
          {member.avatar ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={member.avatar}
              alt={member.name}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[12px] font-medium text-gray-900">
              {member.initials || getInitials(member.name)}
            </div>
          )}
          <span className=" font-inter font-semibold text-sm leading-[14px] tracking-normal text-gray-900 opacity-100">
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
          className="flex items-center gap-1 h-[25px] px-3 py-0.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          {/* Logo - 11px × 12px with 0.5px left offset */}
          <Image
            src={getRoleLogo(member.role)}
            alt={`${member.role} role`}
            width={11}
            height={12}
            className="flex-shrink-0 ml-[0.5px]"
          />
          {/* Text - height 21px, width auto */}
          <span className="h-[21px] flex items-center justify-center text-sm font-inter font-medium  text-center pt-[2px]">
            {member.role}
          </span>
          {/* Chevron - 10px × 10px */}
          <svg
            className="w-[12px] h-[12px] flex-shrink-10  text-gray-500"
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
        </button>

        {/* Role Dropdown - Clean Design without Radio Buttons */}
        {showRoleDropdown && (
          <div className="absolute  px-[8px] py-[8px] z-50 mt-2 w-30 bg-white rounded-md shadow-md border border-gray-200">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                  selectedRole === role
                    ? "bg-gray-100 rounded"
                    : "hover:bg-gray-100  rounded"
                }`}
              >
                {/* Use imported SVG with Image component */}
                <Image
                  src={getRoleLogo(role)}
                  alt={`${role} role`}
                  width={12}
                  height={13}
                  className={`flex-shrink-0 ${
                    selectedRole === role ? "" : "opacity-40"
                  }`}
                />
                <span className="text-gray-700">{role}</span>
              </button>
            ))}
          </div>
        )}
      </td>

      {/* Actions Column */}
      <td className="px-[16px] py-[10px] whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 h-[34px] w-[67px]  px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Edit icon from public folder */}
            <Image
              src="/svgs/settings/editicon.svg"
              alt="Edit"
              width={11}
              height={11}
              className="flex-shrink-0"
            />
            <span className="text-[12px] font-medium text-gray-900 ">Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 h-[34px] w-[82px] py-2 px-3 bg-[#C81E1E] rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            {/* Delete icon - 8px × 9px */}
            <svg
              className="flex-shrink-0 w-3 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-xs font-medium  ">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeamMemberRow;
