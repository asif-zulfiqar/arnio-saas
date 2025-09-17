export const MetricCard = ({ title, value, change, isPositive, hasChart }) => {
  const staticSparklineData = {
    "Messages Sent": [
      15, 20, 18, 25, 22, 28, 24, 30, 27, 32, 29, 35, 31, 28, 33, 30, 35, 32,
      28, 25,
    ],
    "Read Rate": [
      8, 10, 9, 11, 10, 12, 11, 10, 9, 8, 7, 9, 10, 11, 10, 9, 8, 7, 8, 9,
    ],
    "Reply Rate": [
      12, 14, 13, 15, 14, 16, 15, 17, 16, 14, 15, 13, 14, 15, 16, 14, 13, 12,
      14, 15,
    ],
    "Conversion Rate (Orders)": [
      55, 58, 56, 59, 57, 60, 58, 61, 59, 58, 57, 56, 58, 59, 60, 58, 57, 55,
      56, 58,
    ],
    "Revenue Driven": [
      500, 520, 540, 560, 580, 595, 575, 590, 585, 595, 590, 580, 585, 590, 595,
      600, 595, 590, 585, 595,
    ],
    "Click-Through Rate (CTR)": [
      10, 11, 12, 11, 13, 12, 14, 12, 13, 11, 12, 13, 14, 12, 11, 10, 11, 12,
      13, 12,
    ],
  };

  const sparklineData =
    staticSparklineData[title] ||
    Array.from({ length: 20 }, () => Math.random() * 40 + 20);

  const createSparklinePath = (data, width, height) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((point - min) / (max - min)) * height;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const gradientId = `gradient-${title
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")}`;

  return (
    <div className="bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-4">{value}</div>
      {hasChart && (
        <div className="w-full h-12 mt-4">
          <svg
            width="100%"
            height="48"
            viewBox="0 0 280 48"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
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
              d={createSparklinePath(sparklineData, 280, 48)}
              stroke="#3B82F6"
              strokeWidth="2.5"
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
