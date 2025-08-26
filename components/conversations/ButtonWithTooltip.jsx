import { ArrowDown } from "@/app/assets/svgs/icons";
import Image from "next/image";

const ButtonWithTooltip = ({ iconSrc, tooltipText, onClick, children }) => {
  return (
    <div className="flex items-center gap-3 relative">
      <button
        onClick={onClick}
        className="p-[6px] rounded-sm hover:bg-[#EBF5FF] transition-colors relative group"
      >
        <Image src={iconSrc} width={16} height={16} alt="icon" />
        <span className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-20 transition-all duration-300 ease-in-out text-nowrap">
          {tooltipText}
          <span className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <ArrowDown />
          </span>
        </span>
      </button>
      {children}
    </div>
  );
};

export default ButtonWithTooltip;

export const Dropdown = ({ isOpen, onClose }) => {
  return (
    isOpen && (
      <div
        className="absolute bg-white rounded-md shadow-md w-[105px]"
        style={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}
      >
        <ul className="text-sm">
          <li
            onClick={onClose}
            className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Active
          </li>
          <li
            onClick={onClose}
            className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            NGMIT
          </li>
          <li
            onClick={onClose}
            className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Completed
          </li>
        </ul>
      </div>
    )
  );
};
