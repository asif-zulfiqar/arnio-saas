// components/Analytics/DateRangePickerWrapper.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import CalendarIcon from "@/app/assets/svgs/analytics/calendar.svg";

const DateRangePickerWrapper = ({
  initialDateRange = { start: "Dec 31", end: "Jan 31" },
  onDateRangeChange,
}) => {
  // Local state management to prevent external interference
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const containerRef = useRef(null);

  // Calendar state
  const [currentView, setCurrentView] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5));
  const [selectedStart, setSelectedStart] = useState(new Date(2024, 11, 31));
  const [selectedEnd, setSelectedEnd] = useState(new Date(2025, 0, 31));
  const [selectingRange, setSelectingRange] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [viewYear, setViewYear] = useState(2025);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add a small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDayClick = (day, month, year) => {
    if (!day) return;

    const clickedDate = new Date(year, month, day);

    if (!selectingRange || !selectedStart) {
      setSelectedStart(clickedDate);
      setSelectedEnd(null);
      setSelectingRange(true);
    } else {
      if (clickedDate < selectedStart) {
        setSelectedEnd(selectedStart);
        setSelectedStart(clickedDate);
      } else {
        setSelectedEnd(clickedDate);
      }
      setSelectingRange(false);

      const start = clickedDate < selectedStart ? clickedDate : selectedStart;
      const end = clickedDate < selectedStart ? selectedStart : clickedDate;
      const startStr = `${monthsShort[start.getMonth()]} ${start.getDate()}`;
      const endStr = `${monthsShort[end.getMonth()]} ${end.getDate()}`;
      const newRange = { start: startStr, end: endStr };
      setDateRange(newRange);
      if (onDateRangeChange) onDateRangeChange(newRange);
    }
  };

  const isInRange = (day, month, year) => {
    if (!day) return false;
    const date = new Date(year, month, day);

    if (selectingRange && selectedStart && hoverDate) {
      const start = selectedStart < hoverDate ? selectedStart : hoverDate;
      const end = selectedStart < hoverDate ? hoverDate : selectedStart;
      return date >= start && date <= end;
    }

    if (selectedStart && selectedEnd) {
      return date >= selectedStart && date <= selectedEnd;
    }

    return false;
  };

  const isStartOrEnd = (day, month, year) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    const dateTime = date.getTime();

    if (selectedStart && dateTime === selectedStart.getTime()) return true;
    if (selectedEnd && dateTime === selectedEnd.getTime()) return true;

    return false;
  };

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    newDate.setFullYear(viewYear);
    setCurrentMonth(newDate);
    setCurrentView("calendar");
  };

  const handleYearSelect = (year) => {
    setViewYear(year);
    setCurrentView("month");
  };

  const CalendarMonth = ({ month, year }) => {
    const days = getDaysInMonth(new Date(year, month));

    return (
      <div className="w-72">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isSelected = isStartOrEnd(day, month, year);
            const inRange = isInRange(day, month, year);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={index}
                className={`
                  h-9 text-sm rounded transition-colors
                  ${
                    !day ? "cursor-default" : "cursor-pointer hover:bg-gray-100"
                  }
                  ${
                    isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                  }
                  ${inRange && !isSelected ? "bg-[#F3F4F6]" : ""}
                  ${
                    isToday && !isSelected && !inRange
                      ? "font-bold text-blue-600"
                      : ""
                  }
                `}
                disabled={!day}
                onClick={() => handleDayClick(day, month, year)}
                onMouseEnter={() => {
                  if (day && selectingRange) {
                    setHoverDate(new Date(year, month, day));
                  }
                }}
                onMouseLeave={() => setHoverDate(null)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const MonthSelector = () => (
    <div className="p-6 w-[320px]">
      <div className="text-center mb-6 flex items-center justify-between">
        <button
          onClick={() => setViewYear(viewYear - 1)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => setCurrentView("year")}
          className="text-lg font-semibold hover:bg-gray-100 px-3 py-1 rounded transition-colors"
        >
          {viewYear}
        </button>
        <button
          onClick={() => setViewYear(viewYear + 1)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {monthsShort.map((month, index) => {
          const isCurrentMonth =
            currentMonth.getMonth() === index &&
            currentMonth.getFullYear() === viewYear;
          return (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-colors
                ${
                  isCurrentMonth
                    ? "bg-[#1A56DB] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {month}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          className="px-6 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            const today = new Date();
            setCurrentMonth(today);
            setViewYear(today.getFullYear());
            setSelectedStart(today);
            setSelectedEnd(today);
            const newRange = {
              start: `${monthsShort[today.getMonth()]} ${today.getDate()}`,
              end: `${monthsShort[today.getMonth()]} ${today.getDate()}`,
            };
            setDateRange(newRange);
            if (onDateRangeChange) onDateRangeChange(newRange);
            setCurrentView("calendar");
          }}
        >
          Today
        </button>
        <button
          className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => {
            setSelectedStart(null);
            setSelectedEnd(null);
            setSelectingRange(false);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );

  const YearSelector = () => {
    const startYear = Math.floor(viewYear / 10) * 10 - 1;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="p-6 w-[320px]">
        <div className="text-center mb-6 flex items-center justify-between">
          <button
            onClick={() => setViewYear(viewYear - 10)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-lg font-semibold">
            {startYear + 1}-{startYear + 10}
          </span>
          <button
            onClick={() => setViewYear(viewYear + 10)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {years.map((year) => {
            const isCurrentYear = viewYear === year;
            const isOutOfRange = year === startYear || year === startYear + 11;

            return (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`
                  py-3 px-4 rounded-lg text-sm font-medium transition-colors
                  ${
                    isCurrentYear
                      ? "bg-[#1A56DB] text-white"
                      : isOutOfRange
                      ? "text-gray-400 hover:bg-gray-50"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                {year}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            className="px-6 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              const today = new Date();
              setViewYear(today.getFullYear());
              setCurrentView("month");
            }}
          >
            Today
          </button>
          <button
            className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentView("month")}
          >
            Clear
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Image
            src={CalendarIcon}
            alt="Calendar"
            width={16}
            height={16}
            className="flex-shrink-0"
            style={{ verticalAlign: "middle", display: "inline-block" }}
          />
          <span
            className={`text-sm ${
              isOpen ? "text-blue-600 font-medium" : "text-gray-700"
            }`}
            style={{
              verticalAlign: "middle",
              display: "inline-block",
              lineHeight: "16px",
            }}
          >
            {dateRange.start} - {dateRange.end}
          </span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 ${
              isOpen ? "text-[#1A56DB]" : "text-gray-400"
            }`}
            style={{ verticalAlign: "middle", display: "inline-block" }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {currentView === "calendar" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <div className="flex space-x-8">
                  <button
                    onClick={() => {
                      setViewYear(currentMonth.getFullYear());
                      setCurrentView("month");
                    }}
                    className="text-sm font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  >
                    {months[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </button>
                  <span className="text-sm font-semibold text-gray-900 px-2 py-1">
                    {months[(currentMonth.getMonth() + 1) % 12]}{" "}
                    {currentMonth.getMonth() === 11
                      ? currentMonth.getFullYear() + 1
                      : currentMonth.getFullYear()}
                  </span>
                </div>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex space-x-8">
                <CalendarMonth
                  month={currentMonth.getMonth()}
                  year={currentMonth.getFullYear()}
                />
                <CalendarMonth
                  month={(currentMonth.getMonth() + 1) % 12}
                  year={
                    currentMonth.getMonth() === 11
                      ? currentMonth.getFullYear() + 1
                      : currentMonth.getFullYear()
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  className="px-6 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    const today = new Date();
                    setSelectedStart(today);
                    setSelectedEnd(today);
                    const newRange = {
                      start: `${
                        monthsShort[today.getMonth()]
                      } ${today.getDate()}`,
                      end: `${
                        monthsShort[today.getMonth()]
                      } ${today.getDate()}`,
                    };
                    setDateRange(newRange);
                    if (onDateRangeChange) onDateRangeChange(newRange);
                    setIsOpen(false); // Only close on Today button in calendar view
                  }}
                >
                  Today
                </button>
                <button
                  className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedStart(null);
                    setSelectedEnd(null);
                    setSelectingRange(false);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {currentView === "month" && <MonthSelector />}
          {currentView === "year" && <YearSelector />}
        </div>
      )}
    </div>
  );
};

export default DateRangePickerWrapper;
