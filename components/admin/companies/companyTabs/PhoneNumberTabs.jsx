import React from "react";

const phoneNumbersTab = () => {
  const phones = [
    {
      phoneNumbers: "Lisa Taylor",
      deviceId: "bonnie_g23@gmail.com",
      deviceStatus: "Active",
      serverAssigned: "User",
      serverStatus: "Suspend",
      action: "Suspend",
    },
    {
      phoneNumbers: "Jese Leos",
      deviceId: "bonnie_g23@gmail.com",
      deviceStatus: "Active",
      serverAssigned: "User",
      serverStatus: "Suspend",
      action: "Suspend",
    },
    {
      phoneNumbers: "Michael Chen",
      deviceId: "l.livingston@gmail.com",
      deviceStatus: "Active",
      serverAssigned: "Manager",
      serverStatus: "Suspend",
      action: "Suspend",
    },
    {
      phoneNumbers: "Sophia Martinez",
      deviceId: "micheal.g88@gmail.com",
      deviceStatus: "Active",
      serverAssigned: "User",
      serverStatus: "Suspend",
      action: "Suspend",
    },
    {
      phoneNumbers: "Carlos Rivera",
      deviceId: "mcfall.joseph21@gmail.com",
      deviceStatus: "Suspended",
      serverAssigned: "Manager",
      serverStatus: "Reactivate",
      action: "Suspend",
    },
  ];

  return (
    <div className="bg-white rounded-b-xl border border-gray-200">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
      </div>

      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-gray-700 text-xs uppercase border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Phone Numbers</th>
            <th className="px-6 py-3">Device ID</th>
            <th className="px-6 py-3">Device Status</th>
            <th className="px-6 py-3">Server Assigned </th>
            <th className="px-6 py-3">Server Assigned </th>
            <th className="px-6 py-3">Actions </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {phones.map((phn, i) => (
            <tr key={i}>
              <td className="px-6 py-4 flex items-center">
                <span className="font-medium">{phn.phoneNumbers}</span>
              </td>
              <td className="px-6 py-4">{phn.deviceId}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    phn.deviceStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {phn.deviceStatus}
                </span>
              </td>
              <td className="px-6 py-4">{phn.serverAssigned}</td>
              <td className="px-6 py-4">{phn.serverStatus}</td>
              <td className="px-6 py-4">
                <button className="text-sm text-blue-600 hover:underline">
                  {phn.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
        Showing 1–5 of 5
      </div>
    </div>
  );
};

export default phoneNumbersTab;
