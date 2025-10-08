"use client";
import {
  AnalyticsIcon,
  ArrowDown,
  ConversationIcon,
  DocsIcon,
  HelpIcon,
  IntegrationsIcon,
  SettingsIcon,
} from "@/app/assets/svgs/icons";
import { devLog } from "@/data/data";
import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const pages = [
  {
    name: "Conversations",
    icon: <ConversationIcon />,
    url: "/",
    onboardingTarget: null,
  },
  {
    name: "Analytics",
    icon: <AnalyticsIcon />,
    url: "/analytics",
    onboardingTarget: "analytics-icon",
  },
  {
    name: "Campaigns",
    icon: <IntegrationsIcon />,
    url: "/campaigns",
    onboardingTarget: "campaigns-icon",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    url: "/settings",
    onboardingTarget: "settings-icon",
  },
];

const otherPages = [
  { name: "Docs", icon: <DocsIcon />, url: "https://docs.arnio.co/", onboardingTarget: null },
  { name: "Help and first steps", icon: <HelpIcon />, url: "#", onboardingTarget: "help-icon" },
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
  const conversations = useWorkspaceStore((state) => state.conversations);
  const totalUnreadCount = conversations.reduce(
    (total, convo) => total + convo.unreadCount,
    0
  );

  devLog("conversations", conversations, totalUnreadCount);

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
            unreadCount={page.name === "Conversations" ? totalUnreadCount : 0}
            onboardingTarget={page.onboardingTarget}
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
            onboardingTarget={page.onboardingTarget}
          />
        ))}
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;

const LinkItem = ({ name, icon, url, active, expanded, unreadCount, onboardingTarget }) => {
  return (
    <div className="relative group w-full">
      <Link
        href={url}
        data-onboarding-target={onboardingTarget}
        className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-150
        ${active ? "bg-gray-100" : "bg-transparent"} ${
          expanded ? "justify-start px-3" : "justify-center"
        }`}
      >
        <div className="min-w-5 relative">
          {React.cloneElement(icon, { active })}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
        {expanded && (
          <span className="text-base font-medium text-gray-900 whitespace-nowrap overflow-hidden truncate">
            {name}
          </span>
        )}
      </Link>

      {!expanded && (
        <span className="absolute left-[calc(100%+12px)] top-1/2 transform -translate-y-1/2 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-[999] transition-all duration-200 ease-in-out whitespace-nowrap">
          {name}
          <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 rotate-[270deg]">
            <ArrowDown />
          </span>
        </span>
      )}
    </div>
  );
};
