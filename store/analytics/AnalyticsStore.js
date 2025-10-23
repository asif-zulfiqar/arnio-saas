import { create } from "zustand";
import { analyticsService } from "@/lib/api/analytics";

// Single source of truth for workspace ID (you can make this dynamic later)
const WORKSPACE_ID = "arnio-ws-1";

// Helper function to format numbers to two decimal places
const formatToTwoDecimals = (num) => {
  if (typeof num !== "number") return num;
  return parseFloat(num.toFixed(2));
};

// Helper function to format currency to two decimal places
const formatCurrency = (num) => {
  if (typeof num !== "number") return num;
  return parseFloat(num.toFixed(2));
};

// Format metric values based on their type (moved outside the store)
const formatMetricValue = (title, value) => {
  if (typeof value !== "number") return value;

  switch (title) {
    case "Revenue Driven":
      // Format currency with dollar sign and two decimals
      return `$${formatCurrency(value)}`;

    case "Messages Sent":
      // Format as whole number (no decimals)
      return Math.round(value).toString();

    case "Read Rate":
    case "Reply Rate":
    case "Conversion Rate (Orders)":
    case "Click-Through Rate (CTR)":
      // Format percentages with two decimals
      return `${formatToTwoDecimals(value)}%`;

    default:
      return formatToTwoDecimals(value);
  }
};

const useAnalyticsStore = create((set, get) => ({
  // Main metrics
  customerEngagement: {
    percentage: 0,
    change: 0,
    isPositive: true,
  },

  // Date range state (default: last 30 days)
  dateRange: {
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  },

  // Chart data
  chartData: [],

  // KPI metrics
  metrics: [],

  // UI state
  showCalendar: false,
  showExportDropdown: false,
  hoveredPoint: null,
  hasData: false,
  loading: true,
  error: null,

  // Actions
  setDateRange: (dateRange) => {
    set({ dateRange, loading: true });
    get().loadData();
  },

  toggleCalendar: () => set((state) => ({ showCalendar: !state.showCalendar })),
  toggleExportDropdown: () =>
    set((state) => ({ showExportDropdown: !state.showExportDropdown })),
  setHoveredPoint: (point) => set({ hoveredPoint: point }),

  // Load data from both APIs
  loadData: async () => {
    try {
      set({ loading: true, error: null });

      const { dateRange } = get();

      // Call both APIs in parallel
      const [seriesData, summaryData] = await Promise.all([
        analyticsService.getSeries(WORKSPACE_ID, {
          startDate: dateRange.start,
          endDate: dateRange.end,
          period: "DAILY",
        }),
        analyticsService.getSummary(WORKSPACE_ID, {
          startDate: dateRange.start,
          endDate: dateRange.end,
          period: "DAILY",
        }),
      ]);

      // Transform data for UI
      const chartData = analyticsService.transformSeriesData(seriesData.data);
      const metrics = analyticsService.transformSummaryToMetrics(
        summaryData.data
      );
      const customerEngagement =
        analyticsService.transformSummaryToCustomerEngagement(summaryData.data);

      // Format all numeric values to two decimal places
      const formattedMetrics = metrics.map((metric) => ({
        ...metric,
        value: formatMetricValue(metric.title, metric.value),
        change: formatToTwoDecimals(metric.change),
      }));

      const formattedCustomerEngagement = {
        ...customerEngagement,
        percentage: formatToTwoDecimals(customerEngagement.percentage),
        change: formatToTwoDecimals(customerEngagement.change),
      };

      set({
        chartData,
        metrics: formattedMetrics,
        customerEngagement: formattedCustomerEngagement,
        hasData: true,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      const errorMessage = error.message || "Failed to load analytics data";
      set({
        error: errorMessage,
        hasData: false,
        loading: false,
        chartData: [],
        metrics: [],
        customerEngagement: { percentage: 0, change: 0, isPositive: true },
      });
    }
  },

  // Initialize data on store creation
  initialize: () => {
    get().loadData();
  },

  // Delete campaign with API call
  deleteCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      // Call the API to delete campaign
      const response = await campaignService.deleteCampaign(campaignId);

      if (response.success) {
        // Remove from local state immediately for smooth UI update
        set((state) => ({
          campaigns: state.campaigns.filter(
            (campaign) => campaign.id !== campaignId
          ),
          loading: false,
        }));

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to delete campaign");
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to delete campaign";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, error: errorMessage };
    }
  },
}));

// Initialize the store
useAnalyticsStore.getState().initialize();

export default useAnalyticsStore;
