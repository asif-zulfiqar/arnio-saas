import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

function PiechartAdmin({ pieData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col flex-1">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Server Health
          </h2>
          <span className="text-sm text-gray-500 mb-4">
            Last checked 2m ago
          </span>
        </div>
        <button className="text-xs font-medium text-gray-900 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
          View All
        </button>
      </div>

      <div className="h-100">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius="85%"
              paddingAngle={0}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                name,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                // Truncate long names (e.g. "Maintenance" → "Maint.")
                const shortName =
                  name.length > 7 ? name.slice(0, 5) + "." : name;

                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={16}
                    fontWeight="600"
                  >
                    <tspan x={x} dy="-0.3em">
                      {shortName}
                    </tspan>
                    <tspan
                      x={x}
                      dy="1.4em"
                      fontSize={14}
                      fill="#ffffff"
                      fontWeight="500"
                    >
                      {(percent * 100).toFixed(0)}%
                    </tspan>
                  </text>
                );
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value, entry) => {
                const item = pieData.find((d) => d.name === value);
                return (
                  <span className="text-sm text-gray-700">
                    {value} ({item?.value})
                  </span>
                );
              }}
              wrapperStyle={{
                paddingTop: "12px",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PiechartAdmin;
