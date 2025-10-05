"use client";

import { useState } from "react";
import PhoneLinesSection from "./PhoneLinesSection";
import TotalUsageSection from "./TotalUsageSection";

const UsageSection = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Dec 31 - Jan 31");

  const phoneLines = [
    {
      id: 1,
      number: "+1 567 465 4134",
      contactsUsed: 34,
      totalContacts: 50,
      percentage: 68,
      activatedDate: "30 Aug 2024",
    },
    {
      id: 2,
      number: "+1 567 465 4134",
      contactsUsed: 34,
      totalContacts: 50,
      percentage: 68,
      activatedDate: "30 Aug 2024",
    },
    {
      id: 3,
      number: "+1 567 465 4134",
      contactsUsed: 34,
      totalContacts: 50,
      percentage: 68,
      activatedDate: "30 Aug 2024",
    },
    {
      id: 4,
      number: "+1 567 465 4134",
      contactsUsed: 34,
      totalContacts: 50,
      percentage: 68,
      activatedDate: "30 Aug 2024",
    },
  ];

  const totalUsage = {
    current: 5400,
    total: 9000,
    percentage: 60,
    change: 1.14,
  };

  const handleAddNewLine = () => {
    console.log("Add new line clicked");
  };

  const handleIncreaseLimit = () => {
    console.log("Increase limit clicked");
  };

  return (
    <div className="h-full bg-gray-50 ">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
          <PhoneLinesSection
            phoneLines={phoneLines}
            onAddNewLine={handleAddNewLine}
          />

          <TotalUsageSection
            totalUsage={totalUsage}
            selectedDateRange={selectedDateRange}
            onIncreaseLimit={handleIncreaseLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default UsageSection;
