// store/analytics/analyticsStore.js
import { create } from "zustand";

const useAnalyticsStore = create((set, get) => ({
  // Main metrics
  customerEngagement: {
    percentage: 67.3,
    change: 1.4,
    isPositive: true,
  },

  // Chart data
  chartData: [
    { date: "Jan 31", iMessage: 23, SMS: 15 },
    { date: "Feb 31", iMessage: 42, SMS: 25 },
    { date: "Mar 31", iMessage: 35, SMS: 12 },
    { date: "Apr 31", iMessage: 85, SMS: 72 },
    { date: "May 31", iMessage: 32, SMS: 13 },
    { date: "Jun 31", iMessage: 52, SMS: 35 },
    { date: "Jul 31", iMessage: 32, SMS: 15 },
  ],

  // KPI metrics
  metrics: [
    {
      title: "Messages Sent",
      value: 163,
      change: 30,
      isPositive: true,
      hasChart: true,
    },
    {
      title: "Read Rate",
      value: "8%",
      change: -4,
      isPositive: false,
      hasChart: true,
    },
    {
      title: "Reply Rate",
      value: "14%",
      change: 15,
      isPositive: true,
      hasChart: true,
    },
    {
      title: "Conversion Rate (Orders)",
      value: "58.3%",
      change: -2.4,
      isPositive: false,
      hasChart: true,
    },
    {
      title: "Revenue Driven",
      value: "$595",
      change: 24,
      isPositive: true,
      hasChart: true,
    },
    {
      title: "Click-Through Rate (CTR)",
      value: "12%",
      change: 2,
      isPositive: true,
      hasChart: true,
    },
  ],

  // UI state
  showCalendar: false,
  showExportDropdown: false,
  hoveredPoint: null,
  hasData: true,

  // Actions
  setDateRange: (range) => set({ dateRange: range }),
  toggleCalendar: () => set((state) => ({ showCalendar: !state.showCalendar })),
  toggleExportDropdown: () =>
    set((state) => ({ showExportDropdown: !state.showExportDropdown })),
  setHoveredPoint: (point) => set({ hoveredPoint: point }),
  setHasData: (hasData) => set({ hasData }),

  // Simulate data loading
  loadData: async () => {
    set({ hasData: false });
    // Simulate API call
    setTimeout(() => {
      set({ hasData: true });
    }, 1000);
  },
}));

export default useAnalyticsStore;
