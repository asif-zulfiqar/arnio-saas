// app/(protected)/(user)/analytics/page.js
"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "../../../../store/workspace/workspaceStore";
import { ExportDropdown } from "../../../../components/Analytics/ExportDropdown";
import { MetricCard } from "../../../../components/Analytics/MetricCard";
import { EmptyState } from "../../../../components/Analytics/EmptyState";

import AnalyticsChart from "../../../../components/Analytics/AnalyticsChart";
import DateRangePickerWrapper from "@/components/Analytics/DateRangePickerWrapper";

const Analytics = () => {
  const {
    analytics,
    ui,
    toggleCalendar,
    toggleExportDropdown,
    setHoveredPoint,
    loadData,
  } = useWorkspaceStore();

  const {
    customerEngagement,
    chartData,
    metrics,
  } = analytics;

  const {
    showCalendar,
    showExportDropdown,
    hoveredPoint,
    hasData,
  } = ui;

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  if (!hasData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
                <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
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
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          {/* Chart Header with Percentage */}
          <div className="p-6 pb-4">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {customerEngagement.percentage}%
              </span>
              <div
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-md ${
                  customerEngagement.isPositive ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <svg
                  className={`w-4 h-3  ${
                    customerEngagement.isPositive
                      ? "text-green-900"
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
                  className={`text-sm font-bold  ${
                    customerEngagement.isPositive
                      ? "text-green-900"
                      : "text-red-600"
                  }`}
                >
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
              className="bg-white p-6 rounded-lg border border-gray-200"
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
