// utils/ExportUtils.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0] ? parts[0][0].toUpperCase() : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";

  return first + last;
};

function getFirstName(name) {
  if (!name) return "";
  return name.trim().split(" ")[0];
}

function formatPhoneNumber(phone) {
  if (phone == null) return "";

  // keep only first leading '+' and digits
  let cleaned = "";
  for (const ch of String(phone).trim()) {
    const isDigit = ch >= "0" && ch <= "9";
    if (ch === "+" && cleaned.length === 0) cleaned += ch;
    else if (isDigit) cleaned += ch;
  }

  // Normalize to +1 + 10 digits (NANP)
  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  if (digits[0] === "1") {
    // has country code 1 (with or without '+')
    digits = digits.slice(1);
  } else {
    // not a +1 number → return cleaned as-is
    return cleaned;
  }

  // Use the last 10 digits for the national number (common in messy inputs)
  if (digits.length < 10) return cleaned;
  const national = digits.slice(-10);

  const a = national.slice(0, 3);
  const b = national.slice(3, 6);
  const c = national.slice(6);

  return `+1 ${a} ${b} ${c}`;
}

function formatMessageDate(timestamp) {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours = Math.abs(now - messageDate) / (1000 * 60 * 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const timeString = messageDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffInDays === 0) {
    return `Today ${timeString}`;
  } else if (diffInDays === 1) {
    return `Yesterday ${timeString}`;
  } else if (diffInDays < 7) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return `${dayName} ${timeString}`;
  } else {
    return (
      messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: diffInDays > 365 ? "numeric" : undefined,
      }) + ` ${timeString}`
    );
  }
}

function shouldShowTimestamp(currentMsg, index, messages) {
  if (index === 0) return true;

  const prevMsg = messages[index - 1];
  const currentTime = new Date(currentMsg.timestamp);
  const prevTime = new Date(prevMsg.timestamp);

  const minutesDiff = Math.abs(currentTime - prevTime) / (1000 * 60);
  return minutesDiff >= 30;
}

// analytics utils
// Function to export as PDF
export const exportToPDF = async (elementId, filename = "analytics-report") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF export");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Function to export as PNG
export const exportToPNG = async (elementId, filename = "analytics-report") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PNG export");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};

// Function to export as JPEG
export const exportToJPEG = async (
  elementId,
  filename = "analytics-report"
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for JPEG export");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `${filename}.jpeg`;
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.click();
  } catch (error) {
    console.error("Error generating JPEG:", error);
  }
};

// Function to generate a simplified report data structure
export const generateReportData = (storeData) => {
  const { customerEngagement, chartData, metrics } = storeData;

  return {
    title: "Analytics Report",
    generatedAt: new Date().toLocaleString(),
    customerEngagement,
    chartData,
    metrics,
    summary: `Customer Engagement: ${customerEngagement.percentage}% (${
      customerEngagement.isPositive ? "+" : ""
    }${customerEngagement.change}%)`,
  };
};

export {
  getInitials,
  formatPhoneNumber,
  getFirstName,
  formatMessageDate,
  shouldShowTimestamp,
};
