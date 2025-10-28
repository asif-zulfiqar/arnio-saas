import { ArrowRight } from "lucide-react";
import React from "react";

const addOnsData = [
  {
    name: "AI Assistant",
    description: "Automate message replies",
    status: "Active",
    actions: ["Remove", "Edit"],
  },
  {
    name: "Automation Engine",
    description: "Campaign scheduling",
    status: "Inactive",
    actions: ["Enable"],
  },
  {
    name: "Extra Phone Numbers",
    description: "+10 phone lines",
    status: "Active",
    actions: ["Remove", "Edit"],
  },
];

const subscriptionHistoryData = [
  {
    date: "Oct 6, 2025, 10:32 AM",
    action: "Changed Plan",
    changedBy: "Lisa Taylor",
    details: "Plan updated from Starter → Pro",
  },
  {
    date: "Oct 4, 2025, 12:39 AM",
    action: "Add-On Enabled",
    changedBy: "Michael Chen",
    details: "AI Assistant added",
  },
  {
    date: "Oct 7, 2025, 1:45 PM",
    action: "Payment Failed",
    changedBy: "System",
    details: "Retry scheduled",
  },
  {
    date: "Oct 8, 2025, 3:30 AM",
    action: "Subscription Created",
    changedBy: "Tommy Lee",
    details: "Trial started",
  },
  {
    date: "Oct 10, 2025, 2:50 PM",
    action: "Payment Failed",
    changedBy: "Jessica Smith",
    details: "Retry scheduled",
  },
];

const BillingTab = () => {
  return (
    <div className="space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
        <div>
          <h2 className="text-lg font-semibold">Plan</h2>
        </div>

        <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB] mt-4">
          <div className="flex gap-3 justify-between items-center border-b border-gray-200 pb-2">
            <div className="flex gap-4">
              <h2 className="text-lg font-semibold">Plan Name Pro +</h2>
              <span className="text-sm px-2 py-0.5 bg-green-100 text-green-700 rounded">
                Active
              </span>
            </div>
            <div className="space-x-2 flex">
              <button className="text-xs font-medium text-gray-900 px-4 py-2 border border-[#E5E7EB] bg-white rounded-lg">
                Suspend Subscription
              </button>
              <button className="flex items-center gap-2 text-xs font-medium px-4 py-2 text-[#1C64F2] rounded-lg border border-[#1C64F2]">
                Change Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-3 mt-4">
            {[
              { label: "Billing Cycle", value: "Monthly" },
              { label: "Next Renewal", value: "Sep 30, 2025" },
              { label: "Seats", value: "10 users" },
              { label: "Lines", value: "25 phone numbers" },
            ].map((item) => (
              <div key={item.label} className="flex">
                <div className="w-40 font-medium text-gray-800">
                  {item.label}
                </div>
                <div className="flex-1 text-gray-600">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-Ons Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold">Add-Ons</h3>
          <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            + Add Add-On
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-700">
          <thead>
            <tr className="border-b">
              <th className="py-2">Add-On</th>
              <th className="py-2">Description</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {addOnsData.map((addOn, index) => (
              <tr key={index}>
                <td className="py-2">{addOn.name}</td>
                <td>{addOn.description}</td>
                <td>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      addOn.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {addOn.status}
                  </span>
                </td>
                <td>
                  <div className="space-x-2">
                    {addOn.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-sm text-gray-500 mt-2">Showing 1-3 of 3</div>
      </div>

      {/* Subscription History Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-md font-semibold mb-4">Subscription History</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-1 text-sm w-full max-w-xs"
          />
        </div>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-gray-700 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Changed By</th>
              <th className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptionHistoryData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">{item.action}</td>
                <td className="px-6 py-4">{item.changedBy}</td>
                <td className="px-6 py-4">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
          Showing 1–5 of 5
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
