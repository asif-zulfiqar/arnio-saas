// components/Analytics/DateRangePicker.jsx

import Image from "next/image";
import ExportIcon from "@/app/assets/svgs/analytics/export.svg";

export const ExportDropdown = ({ showDropdown, onToggle }) => {
  const exportOptions = [
    { label: "Download PDF", value: "pdf" },
    { label: "Download PNG", value: "png" },
    { label: "Download JPEG", value: "jpeg" },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Image
          src={ExportIcon}
          alt="Export"
          width={16}
          height={16}
          className="flex-shrink-0"
          style={{ verticalAlign: "middle", display: "inline-block" }}
        />
        <span
          style={{
            verticalAlign: "middle",
            display: "inline-block",
            lineHeight: "16px",
          }}
        >
          Export
        </span>
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          {exportOptions.map((option) => (
            <button
              key={option.value}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {
                console.log(`Exporting as ${option.value}`);
                onToggle();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
