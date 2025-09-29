import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

const AppStore = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Commerce", "Marketing", "Support", "Automation"];

  const apps = [
    {
      id: 1,
      name: "Shopify",
      icon: "/svgs/settings/shopify.svg",
      description:
        "Ecommerce platform for managing orders, customers, carts, and tags with real-time webhooks.",
      status: "Coming soon",
      category: ["Commerce"],
      website: "https://www.shopify.com",
    },
    {
      id: 2,
      name: "Klaviyo",
      icon: "/svgs/settings/klaviyo.svg",
      description:
        "Email marketing platform that provides segments and events to power targeted iMessage campaigns.",
      status: "Coming soon",
      category: ["Marketing"],
      website: "https://www.klaviyo.com",
    },
    {
      id: 3,
      name: "Zapier",
      icon: "/svgs/settings/zapier.svg",
      description:
        "No-code automation tool for connecting Arnio with thousands of apps and workflows",
      status: "Coming soon",
      category: ["Automation"],
      website: "https://www.zapier.com",
    },
    {
      id: 4,
      name: "Gorgias",
      icon: "/svgs/settings/gorgias.svg",
      description:
        "Support inbox for Shopify brands that will let Arnio display orders and tickets directly in a conversation thread",
      status: "Coming soon",
      category: ["Support"],
      website: "https://www.gorgias.com",
    },
    {
      id: 5,
      name: "Meta Conversions",
      icon: "/svgs/settings/meta.svg",
      description:
        "Integration to send Arnio conversion events back to Meta for improved ad optimization.",
      status: "Coming soon",
      category: ["Marketing"],
      website:
        "https://www.facebook.com/business/learn/lessons/meta-conversions-api",
    },
    {
      id: 6,
      name: "TikTok Events",
      icon: "/svgs/settings/tiktok.svg",
      description:
        "Integration to feed conversion events into TikTok for campaign optimization.",
      status: "Coming soon",
      category: ["Marketing"],
      website: "https://www.tiktok.com/business/en/events-api",
    },
    {
      id: 7,
      name: "Woocommerce",
      icon: "/svgs/settings/woo.svg",
      description:
        "Ecommerce platform for online stores; APIs are less clean but widely used.",
      status: "Coming soon",
      category: ["Commerce"],
      website: "https://woocommerce.com",
    },
    {
      id: 8,
      name: "BigCommerce",
      icon: "/svgs/settings/bigcommerce.svg",
      description:
        "Ecommerce platform for mid-market brands with reliable APIs.",
      status: "Coming soon",
      category: ["Commerce"],
      website: "https://www.bigcommerce.com",
    },
    {
      id: 9,
      name: "Square",
      icon: "/svgs/settings/square.svg",
      description:
        "Point-of-sale and ecommerce solution for retail stores with Shopify-like needs.",
      status: "Coming soon",
      category: ["Commerce"],
      website: "https://squareup.com",
    },
  ];

  const filteredApps = apps.filter(
    (app) => activeTab === "All" || app.category.includes(activeTab)
  );

  return (
    <div className="h-full bg-gray-50 ">
      <div className="">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-900">All apps</h2>
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  activeTab === tab
                    ? "bg-gray-100 text-blue-600 border-gray-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AppCard = ({ app }) => {
  const getStatusStyles = () => {
    if (app.status === "Installed") {
      return {
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-800",
        iconColor: "text-emerald-800",
        iconPath: "/svgs/settings/tickicon.svg",
        isLucideIcon: false,
        iconProps: { width: 12, height: 12 },
      };
    }
    if (app.status === "Coming soon") {
      return {
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        iconColor: "text-indigo-800",
        iconPath: "/svgs/settings/clockicon.svg",
        isLucideIcon: false,
        iconProps: { width: 12, height: 12 },
      };
    }
    return null;
  };

  const handleDetailsClick = () => {
    if (app.website) {
      window.open(app.website, "_blank", "noopener,noreferrer");
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <div className="border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
            <Image
              src={app.icon}
              alt={app.name}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{app.name}</h3>
        </div>

        {app.status && statusStyles && (
          <div
            className={`flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-lg ${statusStyles.bgColor}`}
          >
            {statusStyles.isLucideIcon ? (
              <statusStyles.icon
                className={statusStyles.iconColor}
                {...statusStyles.iconProps}
              />
            ) : (
              <Image
                src={statusStyles.iconPath}
                alt="status"
                width={statusStyles.iconProps.width}
                height={statusStyles.iconProps.height}
                className={statusStyles.iconColor}
              />
            )}
            <span className={`text-xs font-medium ${statusStyles.textColor}`}>
              {app.status}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        {app.description}
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleDetailsClick}
          className="flex-1 px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          Details
        </button>
        {(!app.status || app.status !== "Installed") && (
          <button className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-800 transition-colors">
            Install
          </button>
        )}
        {app.status === "Installed" && (
          <button className="p-1.5 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AppStore;
