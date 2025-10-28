import SearchBar from "@/components/admin/dashboard/Searchbar";
import { Calendar, ChevronDown, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import CompanyStatusModal from "./CompanyStatusModal";
import { useRouter } from "next/navigation";

function TableCompanies({ companies }) {
  // ⚙️ Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const router = useRouter();

  const itemsPerPage = 50;
  const totalItems = companies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = companies.slice(startIndex, startIndex + itemsPerPage);

  const toggleMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const handleAction = (company, type) => {
    setOpenModal({ company, type });
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden flex-1">
      {/* 🔍 Top Bar */}
      <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            Plan
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            Status
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white hover:bg-gray-50">
            <Calendar className="w-4 h-4 text-gray-500" />
            Created Date
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto py-2">
        <table className="w-full text-sm text-gray-700 table-fixed">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
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
            {currentData.map((c) => (
              <tr key={c.id} className="relative">
                <td className="font-normal text-sm pl-4 py-3">{c?.company}</td>
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
                <td className="px-0 font-normal text-sm">{c?.users}</td>
                <td className="px-0 font-normal text-sm">{c?.phones}</td>
                <td className="px-0 font-normal text-sm">{c?.servers}</td>
                <td className="flex items-center gap-3 py-3 px-0 text-left font-normal text-sm">
                  <button
                    onClick={() => router.push(`/admin/companies/${c.id}`)}
                    className="text-blue-600 border border-blue-600 rounded-lg w-[95px] h-[34px] text-xs font-medium hover:bg-blue-50"
                  >
                    View Details
                  </button>

                  {/* Dropdown trigger */}
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(c.id)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {openMenuId === c.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {c.status === "Active" ? (
                          <button
                            onClick={() => handleAction(c, "suspend")}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Suspend Company
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(c, "reactivate")}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50"
                          >
                            Reactivate Company
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(c, "change-plan")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Change Plan
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {openModal && (
            <CompanyStatusModal
              company={openModal.company}
              type={openModal.type}
              onClose={() => setOpenModal(null)}
            />
          )}
        </table>
      </div>

      {/* 📄 Pagination */}
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

export default TableCompanies;
