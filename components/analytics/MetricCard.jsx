import useAnalyticsStore from "@/store/analytics/AnalyticsStore";

export const MetricCard = ({ title, value, change, isPositive, hasChart }) => {
  const { chartData } = useAnalyticsStore();

  // Function to generate sparkline data from actual chart data
  const getSparklineData = (title) => {
    if (!chartData || chartData.length === 0) {
      return Array.from({ length: 20 }, () => Math.random() * 40 + 20);
    }

    switch (title) {
      case "Messages Sent":
        return chartData.map((item) => item.iMessage || 0);

      case "Read Rate":
        // Calculate read rate from the data
        return chartData.map((item) => {
          const messagesSent = item.iMessage || 0;
          const messagesRead = item.messagesRead || 0;
          return messagesSent > 0 ? (messagesRead / messagesSent) * 100 : 0;
        });

      case "Reply Rate":
        // Calculate reply rate from the data
        return chartData.map((item) => {
          const messagesSent = item.iMessage || 0;
          const replies = item.replies || 0;
          return messagesSent > 0 ? (replies / messagesSent) * 100 : 0;
        });

      case "Conversion Rate (Orders)":
        // Calculate conversion rate from the data
        return chartData.map((item) => {
          const messagesSent = item.iMessage || 0;
          const orders = item.orders || 0;
          return messagesSent > 0 ? (orders / messagesSent) * 100 : 0;
        });

      case "Revenue Driven":
        // Use revenue data directly
        return chartData.map((item) => item.revenue || 0);

      case "Click-Through Rate (CTR)":
        // Calculate CTR from the data
        return chartData.map((item) => {
          const messagesSent = item.iMessage || 0;
          const clicks = item.clicks || 0;
          return messagesSent > 0 ? (clicks / messagesSent) * 100 : 0;
        });

      default:
        return Array.from({ length: 20 }, () => Math.random() * 40 + 20);
    }
  };

  const sparklineData = getSparklineData(title);

  const createSparklinePath = (data, width, height) => {
    if (!data || data.length === 0) return "";

    const max = Math.max(...data);
    const min = Math.min(...data);

    // If all values are the same, create a flat line
    if (max === min) {
      const y = height / 2;
      return `M 0 ${y} L ${width} ${y}`;
    }

    const normalizedData = data.map(
      (point) => height - ((point - min) / (max - min)) * height
    );

    let path = `M 0 ${normalizedData[0]}`;

    for (let i = 1; i < normalizedData.length; i++) {
      const x = (i / (normalizedData.length - 1)) * width;
      const y = normalizedData[i];
      const prevX = ((i - 1) / (normalizedData.length - 1)) * width;
      const prevY = normalizedData[i - 1];

      // Create smooth curve using previous and current points
      const controlX1 = prevX + (x - prevX) / 2;
      const controlX2 = prevX + (x - prevX) / 2;

      path += ` C ${controlX1} ${prevY}, ${controlX2} ${y}, ${x} ${y}`;
    }

    return path;
  };

  const gradientId = `gradient-${title
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")}`;

  // Determine if we should show the chart (only if we have data)
  const shouldShowChart = hasChart && sparklineData && sparklineData.length > 0;

  return (
    <div className="bg-white">
      <div className="flex justify-between items-start mb-0">
        <h3 className="text-base text-gray-500">{title}</h3>
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            isPositive
              ? "text-green-800 bg-[#DEF7EC]"
              : "text-red-800 bg-red-100"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-4">{value}</div>
      {shouldShowChart && (
        <div className="w-full h-[61px] mt-4 p-0">
          <svg
            width="100%"
            height="49"
            viewBox="0 0 280 49"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="10%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`${createSparklinePath(
                sparklineData,
                280,
                48
              )} L 280 48 L 0 48 Z`}
              fill={`url(#${gradientId})`}
            />
            <path
              d={createSparklinePath(sparklineData, 280, 46)}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
