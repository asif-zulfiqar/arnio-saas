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

  const iMessageData = payload.find((p) => p.dataKey === "iMessage");
  const smsData = payload.find((p) => p.dataKey === "SMS");

  // Position tooltip to the left of the cursor position
  const tooltipStyle = {
    position: "absolute",
    left: `${coordinate.x - 240}px`, // Position to the left of cursor
    top: `${coordinate.y - 80}px`, // Center vertically relative to cursor
    pointerEvents: "none",
    zIndex: 1000,
  };

  return (
    <div style={tooltipStyle}>
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px] relative">
        {/* Arrow pointer on the right side */}
        <div
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-[-45deg]"
          style={{ boxShadow: "1px 1px 2px rgba(0,0,0,0.05)" }}
        />

        <div className="text-sm font-medium text-gray-900 mb-3">{label}</div>

        {iMessageData && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">iMessage</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Sent 1,200</div>
              <div>Opened 94%</div>
              <div>Replied 54%</div>
              <div>Converted 23%</div>
            </div>
          </div>
        )}

        {smsData && (
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">SMS</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Sent 1,150</div>
              <div>Opened 54%</div>
              <div>Replied 22%</div>
              <div>Converted 7%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsChart = ({ data, hoveredPoint, onHover }) => {
  return (
    <div className="bg-white">
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">iMessage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">SMS</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(e) => {
              if (e && e.activeLabel) {
                onHover(e.activePayload);
              }
            }}
            onMouseLeave={() => onHover(null)}
          >
            <defs>
              <linearGradient id="iMessageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="smsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32CD32" stopOpacity={0.4} />
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
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
                fill: "white",
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
                fill: "white",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
