// components/Analytics/AnalyticsChart.jsx
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label, coordinate }) => {
  if (!active || !payload || !payload.length || !coordinate) return null;

  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  // Dynamic positioning: show on right if too close to left edge, otherwise on left
  const tooltipWidth = 155;
  const showOnRight = coordinate.x < tooltipWidth + 20; // Add some padding

  const tooltipStyle = {
    position: "absolute",
    left: showOnRight
      ? `${coordinate.x + 15}px` // Position to the right of cursor
      : `${coordinate.x - tooltipWidth}px`, // Position to the left of cursor
    top: `${coordinate.y - 140}px`, // Center vertically relative to cursor
    pointerEvents: "none",
    zIndex: 9999, // Higher z-index
  };

  // Calculate rates for the tooltip
  const iMessageSent = dataPoint.iMessage || 0;
  const iMessageRead = dataPoint.messagesRead || 0;
  const iMessageReplies = dataPoint.replies || 0;
  const iMessageOrders = dataPoint.orders || 0;

  const smsSent = dataPoint.SMS || 0;
  const smsRead = dataPoint.smsRead || 0;
  const smsReplies = dataPoint.smsReplies || 0;
  const smsOrders = dataPoint.smsOrders || 0;

  // Calculate percentages
  const iMessageReadRate =
    iMessageSent > 0 ? ((iMessageRead / iMessageSent) * 100).toFixed(1) : 0;
  const iMessageReplyRate =
    iMessageSent > 0 ? ((iMessageReplies / iMessageSent) * 100).toFixed(1) : 0;
  const iMessageConversionRate =
    iMessageSent > 0 ? ((iMessageOrders / iMessageSent) * 100).toFixed(1) : 0;

  const smsReadRate = smsSent > 0 ? ((smsRead / smsSent) * 100).toFixed(1) : 0;
  const smsReplyRate =
    smsSent > 0 ? ((smsReplies / smsSent) * 100).toFixed(1) : 0;
  const smsConversionRate =
    smsSent > 0 ? ((smsOrders / smsSent) * 100).toFixed(1) : 0;

  return (
    <div style={tooltipStyle}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-w-[135px] relative">
        {/* Arrow pointer - dynamically positioned */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-gray-200 ${
            showOnRight
              ? "left-[-6px] border-r-0 border-t-0 rotate-45" // Arrow on left when tooltip is on right
              : "right-[-6px] border-l-0 border-b-0 rotate-45" // Arrow on right when tooltip is on left
          }`}
          style={{ boxShadow: "1px 1px 2px rgba(0,0,0,0.05)" }}
        />

        <div className="text-sm font-medium text-gray-900 bg-gray-100 px-4 py-2">
          {label}
        </div>

        {iMessageSent > 0 && (
          <div className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">iMessage</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1 pl-4">
              <div>Sent {iMessageSent.toLocaleString()}</div>
              <div>Opened {iMessageReadRate}%</div>
              <div>Replied {iMessageReplyRate}%</div>
              <div>Converted {iMessageConversionRate}%</div>
              {dataPoint.revenue > 0 && (
                <div className="border-t border-gray-100 pt-1 mt-1">
                  Revenue ${dataPoint.revenue.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}

        {smsSent > 0 && (
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">SMS</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1 pl-4">
              <div>Sent {smsSent.toLocaleString()}</div>
              <div>Opened {smsReadRate}%</div>
              <div>Replied {smsReplyRate}%</div>
              <div>Converted {smsConversionRate}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsChart = ({ data, hoveredPoint, onHover }) => {
  // Calculate max value for Y axis with some padding
  const maxValue =
    Math.max(
      ...data.map((item) => Math.max(item.iMessage || 0, item.SMS || 0))
    ) * 1.1;

  return (
    <div className="bg-white">
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm text-gray-500">iMessage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#32CD32]"></div>
            <span className="text-sm text-gray-500">SMS</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 7, left: 0, bottom: 5 }}
            onMouseMove={(e) => {
              if (e && e.activeLabel) {
                onHover(e.activePayload);
              }
            }}
            onMouseLeave={() => onHover(null)}
          >
            <defs>
              <linearGradient id="iMessageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="smsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="40%" stopColor="#32CD32" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-500"
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-500"
              domain={[0, maxValue]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(0,0,0,0.1)",
                strokeWidth: 1,
                strokeDasharray: "none",
              }} // Keep the vertical line
              wrapperStyle={{ position: "relative", zIndex: 1000 }}
              isAnimationActive={false}
            />

            <Area
              type="linear" // Sharp peaks instead of smooth curves
              dataKey="iMessage"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#iMessageGradient)"
              dot={false} // No dots by default
              activeDot={{
                // Only show dot on hover
                r: 6,
                stroke: "#3B82F6",
                strokeWidth: 2,
                fill: "#3B82F6",
              }}
            />

            <Area
              type="linear" // Sharp peaks instead of smooth curves
              dataKey="SMS"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#smsGradient)"
              dot={false} // No dots by default
              activeDot={{
                // Only show dot on hover
                r: 6,
                stroke: "#10B981",
                strokeWidth: 2,
                fill: "#10B981",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
