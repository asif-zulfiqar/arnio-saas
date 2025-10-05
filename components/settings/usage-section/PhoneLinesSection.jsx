"use client";

import { Plus } from "lucide-react";
import Image from "next/image";

const PhoneLineCard = ({ line }) => {
  return (
    <div className="flex items-start gap-[10px] p-4 border bg-gray-50   border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 ">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <img
            src="/svgs/settings/phone.svg"
            alt="Phone"
            className="w-5 h-5 text-gray-600"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-[10px]">
          <h3 className="text-sm font-inter font-medium text-gray-900">
            {line.number}
          </h3>
        </div>
        <div className="flex items-center justify-between mb-[10px]">
          <p className="text-xs text-[#4A5565] mb-2">
            {line.contactsUsed} out of {line.totalContacts} contacts used
          </p>
          <span className="text-sm font-medium text-[#4A5565]">
            {line.percentage}%
          </span>
        </div>

        <div className="flex items-center gap-3 mb-[10px]">
          <div className="flex-1 bg-gray-200 rounded-full h-[6px]">
            <div
              className="bg-blue-600 h-[6px] rounded-full transition-all duration-300"
              style={{ width: `${line.percentage}%` }}
            ></div>
          </div>
        </div>

        <p className="text-[12px] font-inter font-normal text-gray-500 ">
          Activated: {line.activatedDate}
        </p>
      </div>
    </div>
  );
};

const PhoneLinesSection = ({ phoneLines, onAddNewLine }) => {
  return (
    <div className="xl:col-span-4">
      <div className="bg-white rounded-lg shadow-xs border border-[#E5E7EB] p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-[26px]">
          <h2 className="text-xl font-semibold text-gray-900">Phone Lines</h2>
        </div>

        <div className="flex-1 space-y-5  ">
          {phoneLines.map((line) => (
            <PhoneLineCard key={line.id} line={line} />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={onAddNewLine}
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
      </div>
    </div>
  );
};

export default PhoneLinesSection;
