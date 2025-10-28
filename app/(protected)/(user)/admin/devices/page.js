"use client";

import React from "react";

import DevicesTable from "@/components/admin/devices/DevicesTable";
import { Plus } from "lucide-react";

// Example table data
const devices = [
  {
    deviceId: "ARNIO-LINE-01",
    company: "Meadowfield",
    phoneNumbers: "+1 285 55 50 166",
    phoneIndex: 1,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-01",
    serverStatus: "Online",
    apiExpires: "Oct 15, 2025, 10:32 AM",
    webhookUrl: "https://clientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-02",
    company: "BlueReply",
    phoneNumbers: "+1 285 55 50 123",
    phoneIndex: 1,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-02",
    serverStatus: "Online",
    apiExpires: "Oct 14, 2025, 12:39 AM",
    webhookUrl: "https://anotherclientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-03",
    company: "Lane Cord",
    phoneNumbers: "+1 285 55 50 125",
    phoneIndex: 1,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-03",
    serverStatus: "Online",
    apiExpires: "Oct 13, 2025, 1:45 PM",
    webhookUrl: "https://exampleclientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-04",
    company: "Quantum Verse",
    phoneNumbers: "+1 285 55 50 126",
    phoneIndex: 2,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-02",
    serverStatus: "Online",
    apiExpires: "Oct 8, 2025, 5:30 AM",
    webhookUrl: "https://newclientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-05",
    company: "Nebula",
    phoneNumbers: "+1 285 55 50 127",
    phoneIndex: 3,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-05",
    serverStatus: "Online",
    apiExpires: "Oct 10, 2025, 2:50 PM",
    webhookUrl: "https://sampleclientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-06",
    company: "Starlit Path",
    phoneNumbers: "+1 285 55 50 128",
    phoneIndex: 1,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-02",
    serverStatus: "Offline",
    apiExpires: "Oct 13, 2025, 9:00 PM",
    webhookUrl: "https://testclientapp.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-07",
    company: "Echo",
    phoneNumbers: "+1 285 55 50 129",
    phoneIndex: 1,
    provisionStatus: "Inactive",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-01",
    serverStatus: "Offline",
    apiExpires: "Oct 14, 2025, 4:20 PM",
    webhookUrl: "https://demoappclient.com/webhook",
    action: "Suspend",
  },
  {
    deviceId: "ARNIO-LINE-08",
    company: "Horizon",
    phoneNumbers: "+1 285 55 50 130",
    phoneIndex: 1,
    provisionStatus: "Active",
    apiKey: "3aec8277-da8a-44cd-9249-0315199c5a522",
    server: "ARNIO-SRV-08",
    serverStatus: "Offline",
    apiExpires: "Oct 15, 2025, 7:55 AM",
    webhookUrl: "https://fictitiousclientapp.com/webhook",
    action: "Reactivate",
  },
];

export default function Devices() {
  return (
    <div className="bg-gray-50 h-[calc(100vh-103px)]  ">
      <div className="mx-auto overflow-y-auto h-full">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Devices</h1>
          <button className="flex gap-2 items-center justify-center text-blue-600 border border-blue-600 rounded-lg w-[139px] h-[41px] text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </div>
        <DevicesTable devices={devices} />
      </div>
    </div>
  );
}
