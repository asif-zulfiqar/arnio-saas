// components/Analytics/ExportDropdown.jsx
import Image from "next/image";
import ExportIcon from "@/app/assets/svgs/analytics/export.svg";
import {
  exportToPDF,
  exportToPNG,
  exportToJPEG,
  generateReportData,
} from "@/utils/utils";
import useAnalyticsStore from "@/store/analytics/AnalyticsStore";

export const ExportDropdown = ({ showDropdown, onToggle }) => {
  const storeData = useAnalyticsStore.getState();

  const handleExport = (format) => {
    // Generate report data
    const reportData = generateReportData(storeData);

    // Create a temporary container for export
    const exportContainer = document.createElement("div");
    exportContainer.id = "analytics-export-container";
    exportContainer.style.position = "absolute";
    exportContainer.style.left = "-9999px";
    exportContainer.style.top = "-9999px";
    exportContainer.style.width = "1000px";
    exportContainer.style.backgroundColor = "#ffffff";
    exportContainer.style.padding = "20px";
    exportContainer.style.fontFamily = "sans-serif";

    // Add content to the container
    exportContainer.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">${
          reportData.title
        }</h1>
        <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Generated: ${
          reportData.generatedAt
        }</p>
      </div>
      
      <div style="margin-bottom: 20px; background: #f9fafb; padding: 15px; border-radius: 8px;">
        <h2 style="margin: 0 0 10px; color: #374151; font-size: 18px;">Customer Engagement</h2>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 32px; font-weight: bold; color: #111827; margin-right: 10px;">
            ${reportData.customerEngagement.percentage}%
          </span>
          <span style="color: ${
            reportData.customerEngagement.isPositive ? "#059669" : "#dc2626"
          }; 
                background: ${
                  reportData.customerEngagement.isPositive
                    ? "#d1fae5"
                    : "#fee2e2"
                }; 
                padding: 4px 8px; border-radius: 6px; font-weight: 500;">
            ${reportData.customerEngagement.isPositive ? "+" : ""}${
      reportData.customerEngagement.change
    }%
          </span>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px; color: #374151; font-size: 18px;">Message Performance Over Time</h2>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; margin-right: 20px;">
            <div style="width: 12px; height: 12px; background: #3B82F6; border-radius: 50%; margin-right: 5px;"></div>
            <span style="font-size: 14px;">iMessage</span>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="width: 12px; height: 12px; background: #10B981; border-radius: 50%; margin-right: 5px;"></div>
            <span style="font-size: 14px;">SMS</span>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
          ${reportData.chartData
            .map(
              (item) => `
            <div style="border: 1px solid #e5e7eb; padding: 10px; border-radius: 6px;">
              <div style="font-weight: 500; margin-bottom: 8px;">${item.date}</div>
              <div style="color: #3B82F6; margin-bottom: 4px;">iMessage: ${item.iMessage}</div>
              <div style="color: #10B981;">SMS: ${item.SMS}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div>
        <h2 style="margin: 0 0 15px; color: #374151; font-size: 18px;">Key Metrics</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          ${reportData.metrics
            .map(
              (metric) => `
            <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <h3 style="margin: 0; font-size: 14px; color: #6b7280;">${
                  metric.title
                }</h3>
                <span style="color: ${
                  metric.isPositive ? "#059669" : "#dc2626"
                }; 
                      background: ${metric.isPositive ? "#d1fae5" : "#fee2e2"}; 
                      padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 500;">
                  ${metric.isPositive ? "+" : ""}${metric.change}%
                </span>
              </div>
              <div style="font-size: 20px; font-weight: bold; color: #111827;">${
                metric.value
              }</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Add to document
    document.body.appendChild(exportContainer);

    // Export based on format
    setTimeout(() => {
      if (format === "pdf") {
        exportToPDF("analytics-export-container", "analytics-report");
      } else if (format === "png") {
        exportToPNG("analytics-export-container", "analytics-report");
      } else if (format === "jpeg") {
        exportToJPEG("analytics-export-container", "analytics-report");
      }

      // Remove the temporary container
      setTimeout(() => {
        document.body.removeChild(exportContainer);
      }, 100);
    }, 100);

    onToggle();
  };

  const exportOptions = [
    { label: "Download PDF", value: "pdf" },
    { label: "Download PNG", value: "png" },
    { label: "Download JPEG", value: "jpeg" },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Image
          src={ExportIcon}
          alt="Export"
          width={16}
          height={16}
          className="flex-shrink-0"
          style={{ verticalAlign: "middle", display: "inline-block" }}
        />
        <span
          style={{
            verticalAlign: "middle",
            display: "inline-block",
            lineHeight: "16px",
          }}
        >
          Export
        </span>
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-3 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          {exportOptions.map((option) => (
            <button
              key={option.value}
              className="w-full text-centre px-1 py-2 text-[14px] text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => handleExport(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
