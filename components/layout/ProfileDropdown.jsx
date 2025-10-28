"use client";
import { ProfileSettingIcon } from "@/app/assets/svgs/icons";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import useAuthStore from "@/store/auth/authStore";

const ProfileDropdown = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuthStore();

  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

  const handleProfileSettings = () => {
    console.log("Navigate to Profile Settings");
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      window.location.href = '/login';
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Generate initials if no avatar
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {/* Profile Avatar */}
      <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        {user?.avatarUrl ? (
          <Image
            src={user?.avatarUrl}
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-xs font-medium text-gray-700">
              {getInitials()}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-[75%] mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Profile Settings Option */}
          <button
            onClick={handleProfileSettings}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
          >
            <ProfileSettingIcon />
            <span className="text-sm text-gray-700">Profile Settings</span>
          </button>

          {/* Sign Out Option */}
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 transition-colors"
          >
            <LogOut className="size-4 text-red-600" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
