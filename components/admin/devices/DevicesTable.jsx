"use client";
import React, { useState } from "react";
import SearchBar from "@/components/admin/dashboard/Searchbar";
import {
  ChevronDown,
  MoreVertical,
  Download,
  ClipboardList,
} from "lucide-react";
import DeviceActionModal from "./DeviceActionModal";

function DevicesTable({ devices }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const toggleMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const handleAction = (status) => {
    setOpenModal(status);
    setOpenMenuId(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page
  const totalItems = devices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Slice the devices array to get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = devices.slice(startIndex, startIndex + itemsPerPage);

  // Pagination handlers
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="bg-white border border-gray-200 rounded-b-xl ">
      <div className="flex justify-between items-center px-4 py-4 ">
        <SearchBar />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            Company
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={3} />
          </button>

          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            Server
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={3} />
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            Status
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={3} />
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 text-gray-500" strokeWidth={3} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm text-gray-700" style={{ width: "150%" }}>
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="text-left font-semibold pl-4 py-4">Device Id</th>
              <th className="text-left font-semibold px-0">COMPANY</th>
              <th className="text-left font-semibold px-0">Phone Numbers</th>
              <th className="text-left font-semibold px-0">Phone Index</th>
              <th className="text-left font-semibold px-0">Provision Status</th>
              <th className="text-left font-semibold px-0">Server</th>
              <th className="text-left font-semibold px-0">Server Status</th>
              <th className="text-left font-semibold px-0">API Key</th>
              <th className="text-left font-semibold px-0">API Expires</th>
              <th className="text-left font-semibold px-0">Webhook URL</th>
              <th className="text-left font-semibold px-0">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((device) => (
              <tr key={device.deviceId}>
                <td className="font-normal text-sm pl-4 py-3 text-gray-500">
                  {device.deviceId}
                </td>
                <td className="px-0 text-gray-500">{device.company}</td>
                <td className="px-0">
                  <div className="p-1 flex justify-center bg-gray-100 rounded-md text-gray-900">
                    {device.phoneNumbers}
                  </div>
                </td>
                <td className="px-4 text-gray-500">{device.phoneIndex}</td>
                <td className="px-0">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      device.provisionStatus === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {device.provisionStatus}
                  </span>
                </td>
                <td className="px-0">
                  <div className="p-1 flex justify-center bg-gray-100 rounded-md text-gray-900">
                    {device.server}
                  </div>
                </td>
                <td className="px-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      device.serverStatus === "Online"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {device.serverStatus}
                  </span>
                </td>
                <td className="px-0">
                  <div className="border border-gray-200 text-gray-900 rounded-lg p-2 w-[345px] flex gap-3">
                    {device.apiKey}
                    <ClipboardList className="text-gray-400 w-5 h-5" />
                  </div>
                </td>
                <td className="px-0 text-gray-500">{device.apiExpires}</td>
                <td className="px-0">
                  <div className="border border-gray-200 text-gray-900 rounded-lg p-2 w-[345px] flex gap-3">
                    {device.webhookUrl}
                    <ClipboardList className="text-gray-400 w-5 h-5" />
                  </div>
                </td>
                <td className="px-0 font-normal text-sm flex items-center gap-3 py-3">
                  <button
                    onClick={() =>
                      handleAction(
                        device.provisionStatus === "Active"
                          ? "Suspend"
                          : "Reactivate"
                      )
                    }
                    className="text-gray-900 border border-gray-200 rounded-lg w-[95px] h-[34px] text-xs font-medium"
                  >
                    {device.provisionStatus === "Active"
                      ? "Suspend"
                      : "Reactivate"}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(device.deviceId)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {openMenuId === device.deviceId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Rotate Key
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Edit Webhook
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Change Server
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {openModal && (
          <DeviceActionModal
            openModal={openModal}
            onClose={() => setOpenModal(null)}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
        <p>
          Showing <span className="font-medium">{startIndex + 1}</span>–
          <span className="font-medium">
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span>
        </p>

        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            className={`px-2 py-1 border rounded-md ${
              currentPage === 1
                ? "text-gray-300 border-gray-200"
                : "hover:bg-gray-50"
            }`}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 border rounded-md ${
                    page === currentPage
                      ? "bg-blue-50 border-blue-500 text-blue-600"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < totalPages)
            ) {
              return (
                <span key={page} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className={`px-2 py-1 border rounded-md ${
              currentPage === totalPages
                ? "text-gray-300 border-gray-200"
                : "hover:bg-gray-50"
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default DevicesTable;
