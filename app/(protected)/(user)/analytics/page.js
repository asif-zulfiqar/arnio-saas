"use client";

import { useEffect } from "react";
import useAnalyticsStore from "../../../../store/analytics/AnalyticsStore";
import { ExportDropdown } from "../../../../components/analytics/ExportDropdown";
import { MetricCard } from "../../../../components/analytics/MetricCard";
import { EmptyState } from "../../../../components/analytics/EmptyState";
import AnalyticsChart from "../../../../components/analytics/AnalyticsChart";
import DateRangePickerWrapper from "@/components/analytics/DateRangePickerWrapper";

const Analytics = () => {
  const {
    customerEngagement,
    chartData,
    metrics,
    showCalendar,
    showExportDropdown,
    hoveredPoint,
    hasData,
    loading,
    error,
    toggleCalendar,
    toggleExportDropdown,
    setHoveredPoint,
    loadData,
  } = useAnalyticsStore();

  useEffect(() => {
    const handleClickOutside = () => {
      if (showCalendar) toggleCalendar();
      if (showExportDropdown) toggleExportDropdown();
    };

    if (showCalendar || showExportDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showCalendar, showExportDropdown, toggleCalendar, toggleExportDropdown]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
        <div
          className="mx-auto flex-1 overflow-y-auto h-full pb-2
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style]:none
          [scrollbar-width]:none"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <div className="flex items-center space-x-4">
              <DateRangePickerWrapper />
              <ExportDropdown
                showDropdown={showExportDropdown}
                onToggle={toggleExportDropdown}
              />
            </div>
          </div>

          {/* Loading skeleton for chart */}
          <div className="bg-white rounded-lg border border-gray-200 mb-8 shadow-sm">
            <div className="p-6 pb-4">
              <div className="flex items-baseline space-x-3 mb-2">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <hr className="border-gray-200" />
            </div>
            <div className="px-6 pb-6">
              <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Loading skeleton for metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
        <div
          className="mx-auto flex-1 overflow-y-auto h-full pb-2
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style]:none
          [scrollbar-width]:none"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <div className="flex items-center space-x-4">
              <DateRangePickerWrapper />
              <ExportDropdown
                showDropdown={showExportDropdown}
                onToggle={toggleExportDropdown}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-lg font-medium text-gray-900 mb-2">
              Failed to load analytics
            </div>
            <p className="text-gray-500 text-center mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when no data - IMPROVED CONDITION
  const hasAnalyticsData = hasData && chartData && chartData.length > 0;

  if (!hasAnalyticsData) {
    return (
      <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
        <div
          className="mx-auto flex-1 overflow-y-auto h-full pb-2
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style]:none
          [scrollbar-width]:none"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <div className="flex items-center space-x-4">
              <DateRangePickerWrapper />
              <ExportDropdown
                showDropdown={showExportDropdown}
                onToggle={toggleExportDropdown}
              />
            </div>
          </div>

          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div
        className="mx-auto flex-1 overflow-y-auto h-full
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style]:none
        [scrollbar-width]:none"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-4">
            <DateRangePickerWrapper />
            <ExportDropdown
              showDropdown={showExportDropdown}
              onToggle={(e) => {
                e?.stopPropagation();
                toggleExportDropdown();
              }}
            />
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8 shadow-sm">
          {/* Chart Header with Percentage */}
          <div className="p-6 pb-4">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-2xl font-bold text-gray-900">
                {customerEngagement?.percentage?.toFixed(2) ?? "0.00"}%
              </span>
              <div
                className={`flex items-center space-x-1 px-2 py-1.5 rounded-md ${
                  customerEngagement.isPositive ? "bg-[#DEF7EC]" : "bg-red-50"
                }`}
              >
                <svg
                  className={`w-4 h-3 ${
                    customerEngagement.isPositive
                      ? "text-[#03543F]"
                      : "text-red-600 rotate-180"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    customerEngagement.isPositive
                      ? "text-[#03543F]"
                      : "text-red-600"
                  }`}
                >
                  {customerEngagement.isPositive ? "+" : ""}
                  {customerEngagement.change}%
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Customer Engagement Performance
            </p>

            {/* Divider line with padding */}
            <hr className="border-gray-200" />
          </div>

          {/* Chart Content Area */}
          <div className="px-6 pb-6">
            {/* Chart */}
            <AnalyticsChart
              data={chartData}
              hoveredPoint={hoveredPoint}
              onHover={setHoveredPoint}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-[2px_2px_4px_rgba(0,0,0,0.05)]"
            >
              <MetricCard {...metric} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
