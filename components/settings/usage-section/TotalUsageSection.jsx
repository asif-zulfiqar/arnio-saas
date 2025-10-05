import { ChevronDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import CalendarIcon from "@/app/assets/svgs/analytics/calendar.svg";

const TotalUsageSection = ({
  totalUsage = { current: 1800, total: 9000, percentage: 20, change: 1.4 },
  selectedDateRange = "Dec 31 - Jan 31",
  onIncreaseLimit = () => {},
}) => {
  return (
    <div className="xl:col-span-3">
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 h-auto flex flex-col">
        <div className="flex items-center justify-between mb-[24px]">
          <h2 className="text-xl font-semibold text-gray-900">Total Usage</h2>
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Add Calendar Icon */}
              <Image
                src={CalendarIcon}
                alt="Calendar"
                width={16}
                height={16}
                className="flex-shrink-0"
                style={{ verticalAlign: "middle", display: "inline-block" }}
              />
              <span className="text-gray-900 text-sm font-medium">
                {selectedDateRange}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center my-0">
          <div className="relative w-80 h-80">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="20"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#1C64F2"
                strokeWidth="20"
                strokeDasharray={`${
                  (totalUsage.percentage / 100) * (2 * Math.PI * 70)
                } ${2 * Math.PI * 70}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[28.24px] font-bold text-gray-900 whitespace-nowrap">
                {totalUsage.current}/{totalUsage.total}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 ">
          <div className="flex items-center gap-2">
            <span className="text-[24px]  font-bold text-gray-900">
              {totalUsage.percentage}%
            </span>
            <span className="flex items-center bg-[#DEF7EC] text-[#03543F] text-sm font-medium px-2.5 py-0.5 rounded-md">
              <ArrowUp className="w-3 h-3 mr-1" />
              {totalUsage.change}%
            </span>
          </div>

          <button
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors "
            onClick={onIncreaseLimit}
          >
            Increase Limit
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

export default TotalUsageSection;
