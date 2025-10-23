import React from "react";
import Image from "next/image";

const EmptyFaqState = () => {
  return (
    <div className="bg-white min-h-[230px] rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center ">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-5">
        <div className=" relative">
          <Image
            src="/svgs/campaigns/faqchaticon.svg"
            alt="FAQ Chat Icon"
            width={28}
            height={25.67}
            className="object-contain"
          />
        </div>
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-">No FAQs yet</h3>
      <p className="text-sm font-normal text-gray-500 text-center max-w-md">
        Add your first FAQ to let Arno respond automatically.
      </p>
    </div>
  );
};

export default EmptyFaqState;
