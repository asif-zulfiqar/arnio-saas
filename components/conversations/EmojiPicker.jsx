"use client";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const EmojiPickerComponent = ({ isOpen, onClose, onEmojiSelect }) => {
  const pickerRef = useRef(null);

  useOutsideClick(pickerRef, onClose);

  const handleEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full -left-13 mb-2 w-80 bg-white rounded-lg z-50 overflow-hidden"
    >

      {/* Emoji Picker */}
      <div className="max-h-80 overflow-y-auto">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          height={320}
          previewConfig={{
            showPreview: false,
          }}
          skinTonesDisabled={true}
          emojiStyle="native"
          lazyLoadEmojis={true}
          searchPlaceHolder="Search Reaction"
          customStyles={{
            emoji: {
              fontSize: "20px",
            },
            emojiPicker: {
              border: "none",
              borderRadius: "0",
              backgroundColor: "transparent",
            },
            search: {
              border: "1px solid #1C64F2",
              borderRadius: "6px",
              backgroundColor: "#F9FAFB",
            },
            searchInput: {
              color: "#374151 !important",
              fontSize: "14px",
            },
            searchIcon: {
              color: "#1C64F2",
            },
            category: {
              fontSize: "12px",
              fontWeight: "600",
              color: "#1C64F2",
              padding: "8px 12px",
              backgroundColor: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
            },
            emojiList: {
              padding: "8px",
            },
            emojiButton: {
              borderRadius: "6px",
              transition: "background-color 0.2s ease",
              padding: "4px",
            },
            emojiButtonHover: {
              backgroundColor: "#EBF4FF",
            },
            emojiButtonSelected: {
              backgroundColor: "#DBEAFE",
            },
            categories: {
              backgroundColor: "transparent",
            },
            categoryEmoji: {
              fontSize: "16px",
            },
            activeCategoryIndicator: {
              backgroundColor: "#1C64F2",
            },
            categoryButton: {
              color: "#6B7280",
            },
            categoryButtonHover: {
              backgroundColor: "#EBF4FF",
            },
            categoryButtonActive: {
              backgroundColor: "#1C64F2",
              color: "#FFFFFF",
            },
          }}
        />
      </div>
    </div>
  );
};

export default EmojiPickerComponent;
