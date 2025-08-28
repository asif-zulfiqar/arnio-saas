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
  color,
  border,
  bgColor,
  cn,
  status,
  helperText,
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

  const borderClass =
    status === "error"
      ? "border border-red-600 bg-red-50 focus:border-red-600 focus:ring-1 focus:ring-red-600"
      : border
      ? border
      : "border border-gray-300";

  const textColor =
    status === "error"
      ? "text-red-600"
      : selected
      ? "text-gray-900"
      : color || "text-gray-500";

  return (
    <div
      className="relative"
      ref={dropdownRef}
      style={{ width: width || "100%" }}
    >
      {label && (
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}

      <button
        type="button"
        className={`outline-none px-4 h-[42px] ${borderClass} ${
          bgColor
            ? bgColor
            : "bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary"
        } rounded-lg w-full text-sm font-medium flex justify-between items-center ${cn}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: width || "100%" }}
      >
        <span className={`text-sm font-[500] ${textColor}`}>
          {selected ? selected.option : defaultText}
        </span>
        <div
          className={`transition-all duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown
            className={`size-4 ${
              status === "error" ? "text-red-600" : "text-gray-600"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <ul
          className="absolute z-50 h-fit rounded-lg shadow-md cursor-pointer mt-1 bg-white"
          style={{ width: width || "100%" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 ${
                index === 0 ? "hover:rounded-t-lg" : ""
              } ${index === options.length - 1 ? "hover:rounded-b-lg" : ""}`}
              onClick={() => selectHandler(option)}
            >
              {option.option}
            </li>
          ))}
        </ul>
      )}

      {/* helper text below */}
      {helperText && (
        <p
          className={`mt-1 text-sm ${
            status === "error" ? "text-red-600" : "text-gray-500"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
