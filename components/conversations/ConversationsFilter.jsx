import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Check, SlidersHorizontal } from "lucide-react";
import { useRef, useState } from "react";

const ConversationsFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    active: false,
    ngmit: false,
    completed: false,
  });

  const activeFilterCount =
    Object.values(selectedFilters).filter(Boolean).length;

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const toggleFilter = (filterKey) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const filterOptions = [
    {
      key: "active",
      label: "Active",
      checked: selectedFilters.active,
    },
    {
      key: "ngmit",
      label: "NGMIT",
      checked: selectedFilters.ngmit,
    },
    {
      key: "completed",
      label: "Completed",
      checked: selectedFilters.completed,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-1 rounded-md hover:bg-gray-50 transition-colors duration-200"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="size-4 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200" />
        {/* Here you have to show the numbers of active filters counts */}
        {activeFilterCount > 0 && (
          <div className="absolute -top-[6px] -right-[6px] bg-[#E1EFFE] rounded-full text-[10px] font-medium text-[#1E429F] size-4 grid place-items-center">
            {activeFilterCount}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-40 bg-white rounded-lg shadow-md py-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => toggleFilter(option.key)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700"
            >
              {/* Custom Checkbox */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded border transition-all duration-200 ${
                    option.checked
                      ? "bg-primary border-primary"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {option.checked && (
                    <Check
                      className="w-3 h-3 text-white absolute top-[3px] left-[3px] transform -translate-y-px -translate-x-px"
                      strokeWidth={3.5}
                    />
                  )}
                </div>
              </div>

              {/* Label */}
              <span className="flex-1 text-left text-sm text-gray-900 font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationsFilter;
