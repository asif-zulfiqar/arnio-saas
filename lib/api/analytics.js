import api from "./api";

// Analytics service functions
export const analyticsService = {
  // Get series data for charts
  getSeries: async (workspaceId, options = {}) => {
    try {
      const {
        period = "DAILY",
        startDate,
        endDate,
        metricTypes = [
          "MESSAGES_SENT",
          "MESSAGES_READ",
          "REPLIES",
          "CLICKS",
          "ORDERS",
          "REVENUE",
        ],
      } = options;

      const params = {
        period,
        metricTypes: metricTypes.join(","),
      };

      if (startDate) {
        params.startDate = new Date(startDate).toISOString();
      }

      if (endDate) {
        params.endDate = new Date(endDate).toISOString();
      }

      const response = await api.get(`/analytics/${workspaceId}/series`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get summary data for KPIs and metrics
  getSummary: async (workspaceId, options = {}) => {
    try {
      const {
        period = "DAILY",
        startDate,
        endDate,
        metricTypes = [
          "MESSAGES_SENT",
          "MESSAGES_READ",
          "REPLIES",
          "CLICKS",
          "ORDERS",
          "REVENUE",
        ],
      } = options;

      const params = {
        period,
        metricTypes: metricTypes.join(","),
      };

      if (startDate) {
        params.startDate = new Date(startDate).toISOString();
      }

      if (endDate) {
        params.endDate = new Date(endDate).toISOString();
      }

      const response = await api.get(`/analytics/${workspaceId}/summary`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Transform series data for charts (keep your existing logic)
  transformSeriesData: (apiData) => {
    if (!apiData || !apiData.series) return [];

    return Object.entries(apiData.series).map(([date, metrics]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      iMessage: metrics.MESSAGES_SENT || 0,
      SMS: 0,
      messagesSent: metrics.MESSAGES_SENT || 0,
      messagesRead: metrics.MESSAGES_READ || 0,
      replies: metrics.REPLIES || 0,
      orders: metrics.ORDERS || 0,
      revenue: metrics.REVENUE || 0,
      clicks: metrics.CLICKS || 0,
    }));
  },

  // Helper function to format numbers to two decimal places
  formatToTwoDecimals: (num) => {
    if (typeof num !== "number") return num;
    return parseFloat(num.toFixed(2));
  },

  // Transform summary data to metrics format for UI - UPDATED
  transformSummaryToMetrics: (summaryData) => {
    if (!summaryData || !summaryData.kpis) return [];

    const { kpis } = summaryData;
    const { deltas } = kpis;

    return [
      {
        title: "Messages Sent",
        value: kpis.messagesSent || 0, // Keep as number for formatting later
        change: deltas?.messagesSent?.percentChange || 0,
        isPositive: (deltas?.messagesSent?.percentChange || 0) >= 0,
        hasChart: true,
      },
      {
        title: "Read Rate",
        value: kpis.readRate || 0, // Keep as number for formatting later
        change: deltas?.readRate?.percentChange || 0,
        isPositive: (deltas?.readRate?.percentChange || 0) >= 0,
        hasChart: true,
      },
      {
        title: "Reply Rate",
        value: kpis.replyRate || 0, // Keep as number for formatting later
        change: deltas?.replyRate?.percentChange || 0,
        isPositive: (deltas?.replyRate?.percentChange || 0) >= 0,
        hasChart: true,
      },
      {
        title: "Conversion Rate (Orders)",
        value: kpis.conversionRate || 0, // Keep as number for formatting later
        change: deltas?.conversionRate?.percentChange || 0,
        isPositive: (deltas?.conversionRate?.percentChange || 0) >= 0,
        hasChart: true,
      },
      {
        title: "Revenue Driven",
        value: kpis.revenue || 0, // Keep as number for formatting later
        change: deltas?.revenue?.percentChange || 0,
        isPositive: (deltas?.revenue?.percentChange || 0) >= 0,
        hasChart: true,
      },
      {
        title: "Click-Through Rate (CTR)",
        value: kpis.ctr || 0, // Keep as number for formatting later
        change: deltas?.ctr?.percentChange || 0,
        isPositive: (deltas?.ctr?.percentChange || 0) >= 0,
        hasChart: true,
      },
    ];
  },

  // Transform summary data to customer engagement format - UPDATED
  transformSummaryToCustomerEngagement: (summaryData) => {
    if (!summaryData || !summaryData.kpis) {
      return { percentage: 0, change: 0, isPositive: true };
    }

    const { kpis } = summaryData;
    const { deltas } = kpis;

    return {
      percentage: kpis.readRate || 0, // Keep as number for formatting later
      change: deltas?.readRate?.percentChange || 0,
      isPositive: (deltas?.readRate?.percentChange || 0) >= 0,
    };
  },
};
