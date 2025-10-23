import React from "react";
import Image from "next/image";
import Modal from "@/components/global/Modal";

const CampaignDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
  isDeleting = false,
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
            Are you sure you want to delete this Campaign?
          </p>
          {/* {campaignName && (
            <p className="text-gray-900 text-[14px] font-medium mt-2">
              "{campaignName}"
            </p>
          )} */}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] px-20">
          <button
            onClick={onClose}
            className="flex-1 px-[12px] py-[8px] border border-gray-200 text-gray-900 font-inter text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            No, cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-[12px] py-[8px] bg-red-700 text-white font-inter text-[14px] font-medium rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Yes, I'm sure"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CampaignDeleteModal;
