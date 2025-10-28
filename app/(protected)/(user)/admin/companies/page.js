"use client";

import React from "react";
import TableCompanies from "@/components/admin/companies/TableCompanies";

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

export default function Companies() {
  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)] overflow-hidden">
      <div
        className="mx-auto flex-1 overflow-y-auto h-full
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style]:none
        [scrollbar-width]:none"
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Companies</h1>
        <div className="">
          <TableCompanies companies={companies} />
        </div>
      </div>
    </div>
  );
}
