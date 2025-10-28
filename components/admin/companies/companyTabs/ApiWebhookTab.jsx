import { MoreVertical } from "lucide-react";
import React from "react";

const ApiWebhooksTab = () => {
  const apiKeys = [
    {
      key: "3aec8277-da8a-4acd-9249-031519c5a521",
      created: "Oct 6, 2025, 10:32 AM",
      expired: "Oct 6, 2025, 10:32 AM",
      server: "ARNIO-SRV-01",
      status: "Active",
      action: "Rotate",
    },
    {
      key: "3aec8277-da8a-4acd-9249-031519c5a521",
      created: "Oct 8, 2025, 3:30 AM",
      expired: "Oct 8, 2025, 3:30 AM",
      server: "ARNIO-SRV-02",
      status: "Inactive",
      action: "Rotate",
    },
  ];

  const webhooks = [
    {
      url: "https://clientapp.com/webhook",
      event: "message.sent",
      last: "Oct 6, 2025, 10:32 AM",
      status: "Active",
    },
    {
      url: "https://testclientapp.com/webhook",
      event: "notification.received",
      last: "Oct 12, 2025, 8:20 AM",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-10">
      {/* API Keys */}
      <div className="bg-white rounded-b-xl border border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
          <button className="bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
            + Generate Key
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-gray-500 text-xs uppercase border-t border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">API Key</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Expired</th>
              <th className="px-6 py-3">Server</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apiKeys.map((api, i) => (
              <tr key={i}>
                <td className="px-6 py-4 font-mono text-xs">{api.key}</td>
                <td className="px-6 py-4">{api.created}</td>
                <td className="px-6 py-4">{api.expired}</td>
                <td className="px-6 py-4">{api.server}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      api.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {api.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm text-blue-600 hover:underline">
                    {api.action}
                  </button>
                </td>
                <td className="flex items-center gap-3 py-3 px-0 text-left font-normal text-sm">
                  <div className="relative">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold text-gray-900">Webhooks</h2>
          <button className="bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
            + Add Webhook
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-gray-500 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Endpoint URL</th>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Last Delivery</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {webhooks.map((hook, i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-blue-600 underline cursor-pointer">
                  {hook.url}
                </td>
                <td className="px-6 py-4">{hook.event}</td>
                <td className="px-6 py-4">{hook.last}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      hook.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {hook.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiWebhooksTab;
