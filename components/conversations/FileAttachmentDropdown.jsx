"use client";

import { useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const FileAttachmentDropdown = ({ isOpen, onClose, onFileSelect, onPhotoSelect }) => {
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  useOutsideClick(dropdownRef, onClose);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
    onClose();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onPhotoSelect(file);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-lg shadow-md z-50 overflow-hidden"
      >
        <button
          onClick={handleFileClick}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-700">File</span>
        </button>
        
        <button
          onClick={handlePhotoClick}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-700">Photo</span>
        </button>
      </div>
    </>
  );
};

export default FileAttachmentDropdown;
