"use client";

import React from "react";
import WorkspaceIcon from "@/app/assets/svgs/admin/briefcase";
import PiechartAdmin from "@/components/admin/dashboard/Piechart";
import TableDashboard from "@/components/admin/dashboard/TableDashboard";
import UsersIcon from "@/app/assets/svgs/admin/users";
import PhoneIcon from "@/app/assets/svgs/admin/phone";

// Pie chart data
const pieData = [
  { name: "Online", value: 12, color: "#00D5BE" },
  { name: "Offline", value: 3, color: "#FF8A4C" },
  { name: "Maintenance", value: 3, color: "#90A1B9" },
];

// Example table data
const companies = [
  {
    id: 1,
    company: "Meadowfield",
    plan: "PRO",
    status: "Active",
    users: 5,
    phones: 10,
    servers: 10,
  },
  {
    id: 2,
    company: "BlueReply",
    plan: "Starter",
    status: "Active",
    users: 1,
    phones: 1,
    servers: 1,
  },
  {
    id: 3,
    company: "Solar Flare",
    plan: "Starter",
    status: "Inactive",
    users: 1,
    phones: 8,
    servers: 8,
  },
];

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div
        className="mx-auto flex-1 overflow-y-auto h-full
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style]:none
        [scrollbar-width]:none"
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Super Admin Dashboard
        </h1>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                icon={<WorkspaceIcon />}
                title="Active Workspaces"
                value="82"
                change="+0.9%"
                trend="up"
              />
              <StatCard
                icon={<UsersIcon />}
                title="Active Users"
                value="158"
                change="-0.9%"
                trend="down"
              />
              <StatCard
                icon={<PhoneIcon />}
                title="Active Phone Lines"
                value="215"
                available="45"
                change="+0.9%"
                trend="up"
              />
            </div>

            <TableDashboard companies={companies} />
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <StatCard
              title="iMessage Delivery Rate"
              value="95%"
              trend="down"
              extraStats={[
                { label: "Total", value: "230K" },
                { label: "Failed", value: "1.5%" },
                { label: "Avg Time", value: "0.8s" },
                { label: "SMS Fallback", value: "12%" },
              ]}
            />
            {/* Pie Chart */}
            <PiechartAdmin pieData={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({
  title,
  value,
  change,
  trend,
  available,
  extraStats,
  icon,
}) {
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-6 flex flex-col shadow-sm">
      {icon && <span className="mb-1">{icon}</span>}
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {available && <span className="text-sm text-gray-500">Available</span>}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
        {available && (
          <span className="text-3xl font-semibold text-gray-900">
            {available}
          </span>
        )}
      </div>

      {change && (
        <span className={`text-xs mt-1 ${trendColor}`}>
          {change} vs last month
        </span>
      )}

      {extraStats && (
        <div className="grid grid-cols-4 mt-1 text-xs text-gray-500">
          {extraStats.map((stat, i) => (
            <div key={i}>
              <div>{stat.label}</div>
              <div className="font-semibold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
