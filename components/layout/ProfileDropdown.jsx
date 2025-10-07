"use client";
import { ProfileSettingIcon } from "@/app/assets/svgs/icons";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import useAuthStore from "@/store/auth/authStore";

const ProfileDropdown = ({ userImages = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuthStore();

  // Use outside click hook to close dropdown
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

  const displayImages = userImages.slice(0, 4); // Show max 4 images

  const handleProfileSettings = () => {
    console.log("Navigate to Profile Settings");
    setIsDropdownOpen(false);
  };

  const handleSignOut = async() => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {/* Profile Icons Container */}
      <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        {displayImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="user image"
            width={32}
            height={32}
            className={`size-[32px] rounded-full object-cover border-2 border-white ${
              index > 0 ? "-ml-2" : ""
            }`}
          />
        ))}
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
