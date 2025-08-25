"use client";
import {
  AnalyticsIcon,
  ConversationIcon,
  DocsIcon,
  HelpIcon,
  IntegrationsIcon,
  SettingsIcon,
} from "@/app/assets/svgs/icons";
import { CircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

const otherPages = [
  { name: "Docs", icon: <DocsIcon />, url: "#" },
  { name: "Help and first steps", icon: <HelpIcon />, url: "#" },
];

const variants = {
  expanded: {
    width: 250,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  collapsed: {
    width: 60,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const LeftSidebar = ({ isOpen }) => {
  const pathname = usePathname();

  return (
    <motion.aside
      className="bg-white border-r border-[#E5E7EB] flex flex-col items-center justify-between"
      animate={isOpen ? "expanded" : "collapsed"}
      variants={variants}
      initial={false}
      style={{ minWidth: 60, maxWidth: 250 }}
      aria-expanded={isOpen}
    >
      <div className="flex flex-col items-center gap-4 w-full mt-5 px-3">
        {pages.map((page, i) => (
          <LinkItem
            key={i}
            name={page.name}
            icon={page.icon}
            url={page.url}
            active={pathname === page.url}
            expanded={isOpen}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 w-full border-t border-gray-100 py-3 px-3">
        {otherPages.map((page, i) => (
          <LinkItem
            key={i}
            name={page.name}
            icon={page.icon}
            url={page.url}
            active={false}
            expanded={isOpen}
          />
        ))}
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;

const LinkItem = ({ name, icon, url, active, expanded }) => {
  return (
    <Link
      href={url}
      className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-150
        ${active ? "bg-gray-100" : "bg-transparent"} ${
        expanded ? "justify-start px-3" : "justify-center"
      }`}
    >
      <div className="min-w-5">{React.cloneElement(icon, { active })}</div>
      {expanded && (
        <span className="text-base font-medium text-gray-900 whitespace-nowrap overflow-hidden truncate">
          {name}
        </span>
      )}
    </Link>
  );
};
