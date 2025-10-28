"use client";

import React, { useState } from "react";
import {
  AnalyticsIcon,
  ConversationIcon,
  DocsIcon,
  HelpIcon,
  IntegrationsIcon,
  SettingsIcon,
} from "@/app/assets/svgs/icons";
import AdminSettingsIcon from "@/app/assets/svgs/sidebar/AdminsettingsIcon";
import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";

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
    name: "Campaigns",
    icon: <IntegrationsIcon />,
    url: "/campaigns",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    url: "/settings",
  },
];

const otherPages = [
  { name: "Docs", icon: <DocsIcon />, url: "https://docs.arnio.co/" },
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
  const conversations = useWorkspaceStore((state) => state.conversations);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { user } = useAuthStore();

  const totalUnreadCount = conversations.reduce(
    (total, convo) => total + (convo?.unreadCount || 0),
    0
  );

  return (
    <motion.aside
      className="bg-white border-r border-[#E5E7EB] flex flex-col items-center justify-between"
      animate={isOpen ? "expanded" : "collapsed"}
      variants={variants}
      initial={false}
      style={{ minWidth: 60, maxWidth: 250 }}
      aria-expanded={isOpen}
    >
      <div className="flex flex-col items-center gap-2 w-full mt-5 px-3">
        {((user?.user?.role || user?.role) === "ADMIN"
          ? [
              ...pages,
              {
                name: "Admin",
                icon: <AdminSettingsIcon />,
                isDropdown: true,
                subItems: [
                  { name: "Dashboard", url: "/admin/dashboard" },
                  { name: "Companies", url: "/admin/companies" },
                  { name: "Devices", url: "/admin/devices" },
                ],
              },
            ]
          : pages
        ).map((page, i) =>
          page.isDropdown ? (
            <div key={i} className="w-full relative">
              {(() => {
                const isAnySubActive = page.subItems.some(
                  (sub) => pathname === sub.url
                );

                const isActive = isAnySubActive;

                return (
                  <>
                    {/* ✅ Styled same as LinkItem */}
                    <button
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === page.name ? null : page.name
                        )
                      }
                      className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-150
              ${isActive ? "bg-gray-100" : "bg-transparent"}
              ${isOpen ? "justify-start px-3" : "justify-center"}`}
                    >
                      <div className="min-w-5 relative">{page.icon}</div>

                      {isOpen && (
                        <span className="text-base font-medium text-gray-900 whitespace-nowrap overflow-hidden truncate">
                          {page.name}
                        </span>
                      )}

                      {isOpen && (
                        <span
                          className={`ml-auto transform transition-transform ${
                            openDropdown === page.name ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={18} />
                        </span>
                      )}
                    </button>

                    {/* ✅ dropdown (same spacing, subtle indent) */}
                    {openDropdown === page.name && isOpen && (
                      <div className="pl-10 mt-1 space-y-1 w-full overflow-hidden">
                        {page.subItems.map((sub, j) => (
                          <Link
                            key={j}
                            href={sub.url}
                            className={`block text-sm p-2 rounded-md transition-colors
                    ${
                      pathname === sub.url
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <LinkItem
              key={i}
              name={page.name}
              icon={page.icon}
              url={page.url}
              active={pathname === page.url}
              expanded={isOpen}
              unreadCount={page.name === "Conversations" ? totalUnreadCount : 0}
            />
          )
        )}
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

const LinkItem = ({ name, icon, url, active, expanded, unreadCount }) => {
  return (
    <div className="relative group w-full">
      <Link
        href={url}
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
            <ChevronDown />
          </span>
        </span>
      )}
    </div>
  );
};
