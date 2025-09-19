// utils/ExportUtils.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
