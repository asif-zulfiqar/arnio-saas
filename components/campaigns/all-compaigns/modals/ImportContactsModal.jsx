import React, { useState, useRef } from "react";
import Image from "next/image";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import * as XLSX from "xlsx";
import { File } from "lucide-react";

const ImportContactsModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    campaignFormData,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    setCurrentMethodContacts,
    addToAccumulatedContacts,
    currentMethodContacts,
    uploadCSVContacts,
    loading,
  } = useCampaignStore();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(
    campaignFormData?.contactsFile || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Function to create and download sample CSV
  const downloadSampleCSV = () => {
    // Updated sample data with American format including +1 prefix
    const sampleData = [
      ["name", "phone"],
      ["John Doe", "+1 (234) 567-8901"],
      ["Jane Smith", "+1 (987) 654-3210"],
      ["Bob Johnson", "+1 (555) 666-7777"],
      ["Sarah Wilson", "+1 (444) 333-2222"],
      ["Mike Brown", "+1 (666) 777-8888"],
    ];

    // Convert to CSV string
    const csvContent = sampleData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_contacts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const contacts = jsonData
            .map((row, index) => {
              const name = row["name"] || row["Name"] || row["NAME"] || "";
              const phone =
                row["phone"] ||
                row["Phone"] ||
                row["PHONE"] ||
                row["phone number"] ||
                row["Phone Number"] ||
                row["PHONE NUMBER"] ||
                "";

              return {
                id: `import-${index}-${Date.now()}`,
                name: name.toString().trim(),
                phone: phone.toString().trim(),
                status: "valid",
                source: "import",
              };
            })
            .filter((contact) => contact.name || contact.phone);

          resolve(contacts);
        } catch (error) {
          reject(new Error("Failed to parse file: " + error.message));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseTextCSV = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split("\n").filter((line) => line.trim());

          const firstLine = lines[0];
          let delimiter = ",";
          if (firstLine.includes(";") && !firstLine.includes(","))
            delimiter = ";";
          if (
            firstLine.includes("\t") &&
            !firstLine.includes(",") &&
            !firstLine.includes(";")
          )
            delimiter = "\t";

          const contacts = [];
          let hasHeaders = false;

          const firstLineLower = firstLine.toLowerCase();
          if (
            firstLineLower.includes("name") ||
            firstLineLower.includes("phone")
          ) {
            hasHeaders = true;
          }

          for (let i = hasHeaders ? 1 : 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const cells = line
              .split(delimiter)
              .map((cell) => cell.trim().replace(/^"|"$/g, ""));

            if (cells.length >= 2) {
              contacts.push({
                id: `import-${i}-${Date.now()}`,
                name: cells[0] || "",
                phone: cells[1] || "",
                status: "valid",
                source: "import",
              });
            }
          }

          resolve(contacts);
        } catch (error) {
          reject(new Error("Failed to parse CSV: " + error.message));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleFile = async (file) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      validTypes.includes(file.type) ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsx")
    ) {
      setSelectedFile(file);

      setIsLoading(true);
      try {
        let contacts = [];

        if (file.name.endsWith(".xlsx") || file.type.includes("spreadsheet")) {
          contacts = await parseCSV(file);
        } else {
          contacts = await parseTextCSV(file);
        }

        // Validate contacts
        const validatedContacts = validateContacts(contacts);

        updateFormData({
          contactsFile: file,
          contactSource: "import",
          parsedContacts: validatedContacts,
          contactCount: validatedContacts.length,
        });

        setCurrentMethodContacts(validatedContacts);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Error parsing file: " + error.message);
        setSelectedFile(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please upload a valid CSV or XLSX file");
    }
  };

  const validateContacts = (contacts) => {
    return contacts.map((contact) => {
      let status = "valid";
      let issues = [];

      // Phone validation
      if (!contact.phone) {
        status = "invalid";
        issues.push("Missing phone number");
      } else if (!/^[\d\s\-\+\(\)]+$/.test(contact.phone)) {
        status = "warning";
        issues.push("Invalid phone format");
      }

      // Name validation
      if (!contact.name) {
        status = status === "valid" ? "warning" : status;
        issues.push("Missing name");
      }

      return {
        ...contact,
        status,
        issues: issues.length > 0 ? issues : null,
      };
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleNext = async () => {
    if (!selectedFile) {
      alert("Please select a file to import");
      return;
    }

    if (!currentMethodContacts || currentMethodContacts.length === 0) {
      alert("No valid contacts found in the file");
      return;
    }

    // Upload to backend via API
    const result = await uploadCSVContacts(selectedFile);

    if (!result.success) {
      alert(`Failed to upload contacts: ${result.error}`);
      return;
    }

    // Add to accumulated contacts
    addToAccumulatedContacts(currentMethodContacts);

    updateFormData({
      contactsFile: selectedFile,
      contactSource: "import",
      contactCount: currentMethodContacts.length,
    });

    goToNextStep("reviewContacts");
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  if (!showCreateCampaignModal || createCampaignStep !== "importContacts") {
    return null;
  }

  return (
    <Modal
      title="Import Contacts (CSV/XLSX)"
      onClose={closeCreateCampaignModal}
      width="w-[800px]"
    >
      <div className="space-y-5">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 text-sm">Processing file...</p>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <Image
                    src="/svgs/campaigns/importcontact.svg"
                    alt="Import Contacts"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">
                    Drag files here to upload
                  </p>
                  <p className="text-gray-500 text-xs">
                    CSV, XLSX (Max size: 123 MB)
                  </p>
                  <button
                    onClick={handleBrowseClick}
                    className="text-blue-600 hover:text-blue-700 text-xs underline"
                  >
                    or browse for files
                  </button>

                  {/* Download sample CSV link */}
                  <div className="mt-0">
                    <button
                      onClick={downloadSampleCSV}
                      className="text-blue-600 hover:text-blue-700 text-xs underline"
                    >
                      Download sample
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              ) : (
                <File className="w-4 h-4 text-gray-900" />
              )}
              <div>
                <span className="text-sm text-gray-700">
                  {selectedFile.name}
                </span>
                {campaignFormData?.parsedContacts && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({campaignFormData.parsedContacts.length} contacts found)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                updateFormData({
                  contactsFile: null,
                  contactSource: null,
                  parsedContacts: null,
                });
                setCurrentMethodContacts([]);
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              !selectedFile ||
              isLoading ||
              !currentMethodContacts ||
              currentMethodContacts.length === 0 ||
              loading
            }
            className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
              !selectedFile ||
              isLoading ||
              !currentMethodContacts ||
              currentMethodContacts.length === 0 ||
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Uploading..." : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportContactsModal;
