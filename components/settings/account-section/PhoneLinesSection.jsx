import useAccountStore from "../../../store/settings/useAccountStore";
import Image from "next/image";
import Modal from "@/components/global/Modal";
import DeletePhoneLineModal from "./DeletePhoneLineModal"; // Adjust path as needed

const PhoneLinesSection = () => {
  const {
    phoneLines,
    addPhoneLine,
    toggleDeletePhoneModal,
    showDeletePhoneModal,
  } = useAccountStore();

  return (
    <div className="bg-white rounded-lg shadow-xs border border-[#E5E7EB] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#101828]">Phone Lines</h3>
      </div>

      <div className="space-y-[20px] mb-[43px] ">
        {phoneLines.map((phone) => {
          const isActivating = phone.status === "Activating...";

          return (
            <div
              key={phone.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
            >
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] bg-gray-100 rounded-lg flex items-center justify-center ">
                  <Image
                    src="/svgs/settings/phone.svg"
                    alt="phone"
                    width={15}
                    height={20}
                    className={`object-contain text-gray-600 ${
                      isActivating ? "opacity-20" : "opacity-100"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-inter font-medium text-gray-900 mb-1">
                    {phone.number}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      {isActivating ? (
                        <span className="text-gray-500">{phone.status}</span>
                      ) : (
                        <>Activated: {phone.activatedDate}</>
                      )}
                    </span>
                    {phone.limit && (
                      <span className="text-xs text-gray-500">
                        Limit: {phone.limit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => !isActivating && toggleDeletePhoneModal(phone)}
                className={`p-0 rounded-md transition-all duration-200 ${
                  isActivating
                    ? "opacity-20 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
                disabled={isActivating}
              >
                <svg
                  className="w-[18px] h-[20px]"
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
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={addPhoneLine}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Add New Line
          <Image
            src="/svgs/settings/arrowicon.svg"
            alt="Arrow"
            width={12}
            height={9}
          />
        </button>
      </div>

      {/* Delete Modal */}
      {showDeletePhoneModal && (
        <Modal title="Delete Phone Line" onClose={toggleDeletePhoneModal}>
          <DeletePhoneLineModal onClose={toggleDeletePhoneModal} />
        </Modal>
      )}
    </div>
  );
};

export default PhoneLinesSection;
