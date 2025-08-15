"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options,
  defaultText = "Select",
  onSelect,
  initialValue,
  width,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const selectHandler = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option?.value || "not set");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      style={{ width: width || "100%" }}
    >
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <button
        type="button"
        className="mt-2 outline-none px-4 h-[42px] border border-gray-300 bg-gray-50 rounded-lg w-full text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: width || "100%" }}
      >
        <span
          className={`text-sm font-[500] ${
            selected ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {selected ? selected.option : defaultText}
        </span>
        <div
          className={`transition-all duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown className="size-4 text-gray-500" />
        </div>
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 h-fit rounded-lg shadow-md cursor-pointer border-[1px] border-[#54545433] mt-1 bg-white"
          style={{ width: width || "100%" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-primary hover:text-white ${
                selected?.value === option.value
                  ? "bg-gray-100 font-medium"
                  : ""
              } ${index === 0 ? "hover:rounded-t-lg" : ""}
                ${index === options.length - 1 ? "hover:rounded-b-lg" : ""}`}
              onClick={() => selectHandler(option)}
            >
              {option.option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
