import React from "react";
import Image from "next/image";
import Modal from "@/components/global/Modal";

const FaqDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  faqQuestion,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="space-y-6">
        {/* Trash Icon */}
        <div className="flex justify-center mb-4">
          <Image
            src="/svgs/settings/deletemodalicon.svg"
            alt="Delete"
            width={24}
            height={24}
          />
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-[16px] font-inter font-normal leading-[150%]">
            Are you sure you want to delete this Question?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] px-20">
          <button
            onClick={onClose}
            className="flex-1 px-[12px] py-[8px] border border-gray-200 text-gray-900 font-inter text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            No, cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-[12px] py-[8px] bg-red-700 text-white font-inter text-[14px] font-medium rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
          >
            {loading ? "Deleting..." : "Yes, I'm sure"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FaqDeleteModal;
