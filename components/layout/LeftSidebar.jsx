"use client";
import {
  AnalyticsIcon,
  ConversationIcon,
  IntegrationsIcon,
  SettingsIcon,
} from "@/app/assets/svgs/icons";
import { CircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const pages = [
  {
    name: "Conversations",
    icon: <ConversationIcon />,
    url: "/",
  },
  {
    name: "Analytics",
    icon: <AnalyticsIcon />,
    url: "/analytics",
  },
  {
    name: "Integrations",
    icon: <IntegrationsIcon />,
    url: "/integrations",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    url: "/settings",
  },
];

const LeftSidebar = () => {
  const pathname = usePathname();
  console.log("Current Pathname:", pathname);
  return (
    <aside className="w-[60px] bg-white border-r border-[#E5E7EB] py-5 px-3 flex flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-4">
        {pages.map((page, i) => (
          <LinkItem
            key={i}
            name={page.name}
            icon={page.icon}
            url={page.url}
            active={pathname === page.url}
          />
        ))}
      </div>
      <CircleQuestionMark className="size-5 text-gray-400 cursor-pointer" />
    </aside>
  );
};

export default LeftSidebar;

const LinkItem = ({ name, icon, url, active }) => {
  return (
    <Link
      href={url}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-all duration-150 ${
        active ? "bg-gray-100" : "bg-transparent"
      }`}
    >
      {React.cloneElement(icon, { active })}
    </Link>
  );
};
