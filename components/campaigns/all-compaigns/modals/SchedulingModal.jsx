import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import { MoveLeft, MoveRight, ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";

const SchedulingModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    editSource,
    isEditMode,
    editingCampaignId,
    // Store state
    campaignStartDate,
    setCampaignStartDate,
    dailySendingCapacity,
    setDailySendingCapacity,
    accumulatedContacts,
    // Phone numbers APIs
    getAvailablePhones,
    getCampaignSenders,
    togglePhoneNumber,
    selectAllAvailablePhones,
    clearAllSelectedPhones,
    availablePhones,
    campaignSenders,
    // Schedule API
    scheduleCampaign,
    // Daily status APIs
    getCampaignDailyStatus,
    dailyStatus,
    dailyStatusLoading,
    // Campaign API
    getCampaignById,
    // Summary API for persistence
    getCampaignSummary,
    loading,
  } = useCampaignStore();

  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isLoadingPhones, setIsLoadingPhones] = useState(false);

  // FIXED: Use scheduledAt from campaign API if available, otherwise use current date
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  // Load campaign data to get scheduledAt when modal opens
  useEffect(() => {
    const loadCampaignSchedulingData = async () => {
      if (showCreateCampaignModal && createCampaignStep === "scheduling") {
        try {
          // If we're in edit mode, load the campaign to get scheduledAt
          if (isEditMode && editingCampaignId) {
            const campaignResult = await getCampaignById(editingCampaignId);

            if (campaignResult.success && campaignResult.data) {
              const campaign = campaignResult.data;

              // Use scheduledAt if available, otherwise use current date
              if (campaign.scheduledAt) {
                const scheduledDate = new Date(campaign.scheduledAt);
                if (!isNaN(scheduledDate.getTime())) {
                  setSelectedDateTime(scheduledDate);
                  setCampaignStartDate(scheduledDate);
                  console.log(
                    "Loaded scheduledAt from campaign:",
                    scheduledDate
                  );
                }
              } else {
                // No scheduledAt, use current date
                const currentDate = new Date();
                setSelectedDateTime(currentDate);
                setCampaignStartDate(currentDate);
                console.log("No scheduledAt found, using current date");
              }
            }
          } else {
            // Creation mode - use current date
            const currentDate = new Date();
            setSelectedDateTime(currentDate);
            setCampaignStartDate(currentDate);
          }
        } catch (error) {
          console.log("Error loading campaign data:", error);
          // Fallback to current date
          const currentDate = new Date();
          setSelectedDateTime(currentDate);
          setCampaignStartDate(currentDate);
        }
      }
    };

    loadCampaignSchedulingData();
  }, [
    showCreateCampaignModal,
    createCampaignStep,
    isEditMode,
    editingCampaignId,
    getCampaignById,
    setCampaignStartDate,
  ]);

  // Extract components from the date
  const selectedDate = selectedDateTime.getDate();
  const selectedMonth = selectedDateTime.getMonth();
  const selectedYear = selectedDateTime.getFullYear();
  const selectedHour = selectedDateTime.getHours() % 12 || 12;
  const selectedMinute = selectedDateTime.getMinutes();
  const selectedPeriod = selectedDateTime.getHours() >= 12 ? "PM" : "AM";

  // Update date time when any component changes
  const updateDateTime = (updates) => {
    const newDate = new Date(selectedDateTime);

    if (updates.date !== undefined) newDate.setDate(updates.date);
    if (updates.month !== undefined) newDate.setMonth(updates.month);
    if (updates.year !== undefined) newDate.setFullYear(updates.year);

    // Handle hour updates with period consideration
    if (updates.hour !== undefined) {
      let hour = updates.hour;
      const currentPeriod = updates.period || selectedPeriod;
      if (currentPeriod === "PM" && hour !== 12) hour += 12;
      if (currentPeriod === "AM" && hour === 12) hour = 0;
      newDate.setHours(hour);
    }

    if (updates.minute !== undefined) newDate.setMinutes(updates.minute);

    // Handle period changes
    if (updates.period !== undefined) {
      let hours = newDate.getHours();
      if (updates.period === "PM" && hours < 12) hours += 12;
      if (updates.period === "AM" && hours >= 12) hours -= 12;
      newDate.setHours(hours);
    }

    setSelectedDateTime(newDate);
    setCampaignStartDate(newDate); // Update store immediately
  };

  // Fixed month navigation
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      updateDateTime({ month: 11, year: selectedYear - 1 });
    } else {
      updateDateTime({ month: selectedMonth - 1 });
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      updateDateTime({ month: 0, year: selectedYear + 1 });
    } else {
      updateDateTime({ month: selectedMonth + 1 });
    }
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (day) {
      updateDateTime({ date: day });
    }
  };

  // Handle time changes
  const handleHourChange = (newHour) => {
    updateDateTime({ hour: newHour });
  };

  const handleMinuteChange = (newMinute) => {
    updateDateTime({ minute: newMinute });
  };

  const handlePeriodChange = (newPeriod) => {
    updateDateTime({ period: newPeriod });
  };

  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);
  const phoneDropdownRef = useRef(null);

  // Calculate daily sending capacity based on selected phone numbers
  const calculatedDailyCapacity = campaignSenders.length * 50;

  // Load available phones, campaign senders, and daily status when modal opens
  useEffect(() => {
    const loadPhoneData = async () => {
      if (showCreateCampaignModal && createCampaignStep === "scheduling") {
        setIsLoadingPhones(true);
        try {
          await Promise.all([
            getAvailablePhones(),
            getCampaignSenders(),
            getCampaignDailyStatus(), // Load daily status
          ]);
        } catch (error) {
          console.error("Failed to load phone data:", error);
        } finally {
          setIsLoadingPhones(false);
        }
      }
    };

    loadPhoneData();
  }, [
    showCreateCampaignModal,
    createCampaignStep,
    getAvailablePhones,
    getCampaignSenders,
    getCampaignDailyStatus,
  ]);

  // Update daily sending capacity when phone numbers change
  useEffect(() => {
    const newCapacity = campaignSenders.length * 50;
    setDailySendingCapacity(newCapacity);
  }, [campaignSenders.length, setDailySendingCapacity]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close date picker
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      // Close phone dropdown
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(event.target) &&
        !event.target.closest("[data-phone-dropdown-trigger]")
      ) {
        setShowPhoneDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Use campaignSenders from API for selected numbers
  const selectedNumbers = campaignSenders;

  const handlePhoneToggle = async (phone) => {
    const result = await togglePhoneNumber(phone);

    if (!result.success) {
      console.error("Failed to toggle phone:", result.error);
      return;
    }

    // ALWAYS refresh daily status after ANY phone change (add or remove)
    await getCampaignDailyStatus();

    if (phoneError && campaignSenders.length > 0) {
      setPhoneError(false);
    }
  };

  const handleSelectAll = async () => {
    if (campaignSenders.length === availablePhones.length) {
      await clearAllSelectedPhones();
    } else {
      await selectAllAvailablePhones();
    }

    // ALWAYS refresh daily status after select all/clear all
    await getCampaignDailyStatus();

    if (phoneError) {
      setPhoneError(false);
    }
  };

  // Calculate progress from daily status data
  const calculateProgress = () => {
    if (!dailyStatus) return 60; // Default to 60% if no data

    const { totalCapacity, totalSent } = dailyStatus;
    if (totalCapacity === 0) return 0;

    return Math.round((totalSent / totalCapacity) * 100);
  };

  // Calculate estimated completion dynamically
  const calculateEstimatedCompletion = () => {
    if (accumulatedContacts.length === 0) return null;

    const totalContacts = accumulatedContacts.length;
    const daysNeeded = Math.ceil(totalContacts / calculatedDailyCapacity);

    const completionDate = new Date(selectedDateTime);
    completionDate.setDate(completionDate.getDate() + daysNeeded);

    return completionDate;
  };

  const handleNext = async () => {
    // Validate phone numbers
    if (!campaignSenders || campaignSenders.length === 0) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    // FIX: Create the date in the correct timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert selectedDateTime to ISO string with proper timezone handling
    const scheduleData = {
      startAt: selectedDateTime.toISOString(),
      timezone: userTimezone,
    };

    console.log("Scheduling payload:", scheduleData); // Debug log

    const result = await scheduleCampaign(scheduleData);

    if (!result.success) {
      console.error("Failed to schedule campaign:", result.error);
      return;
    }

    // Check if we came from summary edit
    if (
      editSource &&
      (editSource === "summary_contacts" || editSource === "summary_scheduling")
    ) {
      goToNextStep("loading");
    } else {
      goToNextStep("ciara_agent_setup");
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  // Calendar utilities
  const monthNames = [
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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Format for display
  const formatDateTime = () => {
    const monthName = monthNames[selectedMonth].slice(0, 3);
    return `${monthName} ${selectedDate}, ${selectedHour}:${selectedMinute
      .toString()
      .padStart(2, "0")}${selectedPeriod.toLowerCase()}`;
  };

  const estimatedCompletion = calculateEstimatedCompletion();
  const progress = calculateProgress();
  const isAllSelected =
    campaignSenders.length === availablePhones.length &&
    availablePhones.length > 0;

  // Loading skeleton component for specific values
  const LoadingSkeleton = ({ width = "w-16", height = "h-4" }) => (
    <div
      className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}
    ></div>
  );

  if (!showCreateCampaignModal || createCampaignStep !== "scheduling") {
    return null;
  }

  return (
    <>
      <Modal
        title="Scheduling Options"
        onClose={closeCreateCampaignModal}
        width="w-[600px]"
      >
        <div className="space-y-5">
          {/* Phone Numbers Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Numbers to Send From
            </label>
            <div className="relative">
              <div
                data-phone-dropdown-trigger
                onClick={() =>
                  !isLoadingPhones && setShowPhoneDropdown(!showPhoneDropdown)
                }
                className={`flex flex-wrap gap-2 bg-gray-50 rounded-lg px-4 py-3 border cursor-pointer min-h-[42px] items-center ${
                  phoneError ? "border-red-500" : "border-gray-300"
                } ${
                  isLoadingPhones
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isLoadingPhones ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-500 text-sm">
                      Loading phones...
                    </span>
                  </div>
                ) : campaignSenders.length > 0 ? (
                  <>
                    {campaignSenders.map((number) => (
                      <div
                        key={number}
                        className="inline-flex items-center gap-2 bg-gray-200 px-2.5 py-0.5 rounded-md border border-gray-200 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-gray-700">{number}</span>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handlePhoneToggle(number);
                          }}
                          disabled={loading || dailyStatusLoading}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <ChevronDown size={20} className="text-gray-400 ml-auto" />
                  </>
                ) : (
                  <>
                    <span className="text-gray-500 text-sm">
                      Choose phone numbers...
                    </span>
                    <ChevronDown size={20} className="text-gray-400 ml-auto" />
                  </>
                )}
              </div>

              {phoneError && (
                <p className="text-red-500 text-xs mt-1">
                  Please select at least one phone number
                </p>
              )}

              {showPhoneDropdown && !isLoadingPhones && (
                <div
                  ref={phoneDropdownRef}
                  className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 mb-3 rounded">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={loading || dailyStatusLoading}
                      className="appearance-none w-4 h-4 border-1 border-gray-300 rounded-sm bg-white cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Select All
                    </span>
                  </label>
                  {availablePhones.map((number) => (
                    <label
                      key={number}
                      className="flex items-center gap-2 mt-3 cursor-pointer hover:bg-gray-50 rounded ml-6"
                    >
                      <input
                        type="checkbox"
                        checked={campaignSenders.includes(number)}
                        onChange={async () => await handlePhoneToggle(number)}
                        disabled={loading || dailyStatusLoading}
                        className="appearance-none w-4 h-4 border-1 border-gray-300 rounded-sm bg-white cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-900">{number}</span>
                    </label>
                  ))}

                  {availablePhones.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-2 px-2">
                      No available phone numbers found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Campaign Capacity Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Campaign Capacity
            </h3>

            {/* Duration */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Duration: ~
                {estimatedCompletion
                  ? Math.ceil(
                      (estimatedCompletion - selectedDateTime) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 30}{" "}
                days
              </p>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
                  style={{
                    width: estimatedCompletion ? `${progress}%` : "0%",
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estimated Completion:{" "}
                {estimatedCompletion
                  ? estimatedCompletion.toLocaleDateString()
                  : "Select start date"}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Contacts uploaded:
                </span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-0.5 rounded-md">
                  {accumulatedContacts.length.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Daily sending capacity:
                </span>
                {dailyStatusLoading ? (
                  <LoadingSkeleton width="w-20" height="h-6" />
                ) : (
                  <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-0.5 rounded-md">
                    {dailyStatus?.overallRemaining || calculatedDailyCapacity}{" "}
                    contacts
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start sending on:</span>
                <div className="relative">
                  <button
                    ref={dateButtonRef}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Image
                      src="/svgs/campaigns/calendaricon.svg"
                      alt="Calendar"
                      width={12}
                      height={12}
                    />
                    {formatDateTime()}
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-4">
              <div className="items-center justify-centre p-1 bg-blue-100 rounded-lg">
                <Image
                  src="/svgs/campaigns/rocketicon.svg"
                  alt="Rocket"
                  width={16}
                  height={16}
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-700">
                  Need faster? Add more lines to reach contacts sooner.
                </p>
                <button
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
                  onClick={() =>
                    window.open(
                      "https://buy.stripe.com/3cIaEW1FK1tu2TgfKKejK03",
                      "_blank"
                    )
                  }
                >
                  Add More Lines
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-[14px]">
            <button
              onClick={handleBack}
              disabled={loading}
              className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading || campaignSenders.length === 0}
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                loading || campaignSenders.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Scheduling..." : "Next"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <div
          ref={datePickerRef}
          className="fixed z-[1000] bg-white border border-gray-200 rounded-lg shadow-xl p-4"
          style={{
            width: "496px",
            height: "267px",
            top: `${
              (dateButtonRef.current?.getBoundingClientRect().bottom || 0) + 8
            }px`,
            left: `${
              (dateButtonRef.current?.getBoundingClientRect().left || 0) - 300
            }px`,
          }}
        >
          <div className="flex gap-5 h-full">
            {/* Calendar Section */}
            <div className="flex-1 flex flex-col">
              {/* Calendar Header - FIXED NAVIGATION */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handlePreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoveLeft size={20} strokeWidth={3} />
                </button>
                <span className="text-sm font-semibold">
                  {monthNames[selectedMonth]} {selectedYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoveRight size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center flex-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  )
                )}
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    disabled={!day}
                    className={`py-1 text-xs rounded-lg ${
                      day === selectedDate
                        ? "bg-blue-600 text-white font-bold"
                        : day
                        ? "hover:bg-gray-100 text-gray-900 font-bold"
                        : "text-gray-300"
                    }`}
                  >
                    {day || ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector Section - UPDATES IMMEDIATELY */}
            <div className="flex flex-col justify-start w-32 mt-4">
              {/* AM/PM Toggle - UPDATES IMMEDIATELY */}
              <div className="flex items-center border border-gray-200 rounded-lg mb-4">
                <button
                  onClick={() => handlePeriodChange("AM")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    selectedPeriod === "AM"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => handlePeriodChange("PM")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    selectedPeriod === "PM"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  PM
                </button>
              </div>

              {/* Hour and Minute Spinners - UPDATES IMMEDIATELY */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-5">hour</span>
                  <button
                    onClick={() =>
                      handleHourChange(Math.min(12, selectedHour + 1))
                    }
                    className="mb-5"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-base font-medium">
                    {selectedHour}
                  </div>
                  <button
                    onClick={() =>
                      handleHourChange(Math.max(1, selectedHour - 1))
                    }
                    className="mt-5"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-5">min</span>
                  <button
                    onClick={() =>
                      handleMinuteChange(Math.min(59, selectedMinute + 1))
                    }
                    className="mb-5"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-base font-medium">
                    {selectedMinute.toString().padStart(2, "0")}
                  </div>
                  <button
                    onClick={() =>
                      handleMinuteChange(Math.max(0, selectedMinute - 1))
                    }
                    className="mt-5"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulingModal;
