import React from "react";
import { MoreVertical } from "lucide-react";
import SearchBar from "@/components/admin/dashboard/Searchbar";

function TableDashboard({ companies }) {
  return (
    <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden flex-1 ">
      <div className="flex justify-between items-center px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
        <div className="flex items-center">
          <SearchBar />
          <button className="text-xs font-medium text-gray-900 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto py-2">
        <table className="w-full text-sm text-gray-700 ">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 ">
              <th className="text-left font-semibold pl-4 py-4">Company</th>
              <th className="text-left font-semibold px-0">Plan/Tier</th>
              <th className="text-left font-semibold px-0">Status</th>
              <th className="text-left font-semibold px-0">Users</th>
              <th className="text-left font-semibold px-0">Phones</th>
              <th className="text-left font-semibold px-0">Server Assigned</th>
              <th className="text-left font-semibold px-0">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((c) => (
              <tr key={c.id}>
                <td className=" font-normal text-sm pl-4 py-3">{c.company}</td>
                <td className="px-0">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      c.plan === "PRO"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {c.plan}
                  </span>
                </td>
                <td className="px-0">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-0 font-normal text-sm">{c.users}</td>
                <td className="px-0 font-normal text-sm">{c.phones}</td>
                <td className="px-0 font-normal text-sm">{c.servers}</td>
                <td className="flex items-center gap-3 py-3 px-0 text-left font-normal text-sm">
                  <button className="text-blue-600 border border-blue-600 rounded-lg w-[95px] h-[34px] text-xs font-medium hover:bg-blue-50">
                    View Details
                  </button>
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableDashboard;
