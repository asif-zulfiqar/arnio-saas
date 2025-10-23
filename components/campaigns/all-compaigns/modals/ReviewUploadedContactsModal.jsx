import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const ReviewUploadedContactsModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    campaignFormData,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    accumulatedContacts,
    updateAccumulatedContacts,
    setContactMethod,
    contactMethod,
    isEditMode,
    editingCampaignId,
    editSource,
    setEditSource,
    getCampaignContacts,
    deleteCampaignContact,
    loading,
  } = useCampaignStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [processedContacts, setProcessedContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // Memoize the load function to prevent infinite loops
  const loadCampaignContacts = useCallback(async () => {
    if (!isEditMode) {
      // In create mode, use accumulated contacts
      console.log(
        "Create mode - using accumulated contacts:",
        accumulatedContacts
      );
      setProcessedContacts(accumulatedContacts);
      return;
    }

    // In edit mode, load contacts from API with the campaign ID
    setIsLoadingContacts(true);
    try {
      console.log(
        "Edit mode - loading contacts for campaign:",
        editingCampaignId
      );

      if (!editingCampaignId) {
        console.error("No editingCampaignId found!");
        setIsLoadingContacts(false);
        return;
      }

      // PASS THE CAMPAIGN ID HERE
      const result = await getCampaignContacts(editingCampaignId);
      console.log("API Response:", result);

      if (result.success && result.data) {
        // Use the correct response structure from your API
        const contactsData = result.data.items || [];

        console.log("Extracted contacts data:", contactsData);

        const apiContacts = contactsData.map((contact, index) => ({
          id: `api-${contact.phone}-${Date.now()}-${index}`,
          name: contact.name || `Contact ${index + 1}`,
          phone: contact.phone,
          status: "valid",
          source: "api",
        }));

        console.log("Mapped API contacts:", apiContacts);
        setProcessedContacts(apiContacts);
        updateAccumulatedContacts(apiContacts);
      } else {
        console.error("Failed to load contacts:", result.error);
      }
    } catch (error) {
      console.error("Error loading campaign contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [
    isEditMode,
    accumulatedContacts,
    editingCampaignId,
    getCampaignContacts,
    updateAccumulatedContacts,
  ]);

  // Simple fix - load only once when modal opens
  useEffect(() => {
    if (showCreateCampaignModal && createCampaignStep === "reviewContacts") {
      const loadContacts = async () => {
        if (!isEditMode) {
          setProcessedContacts(accumulatedContacts);
          return;
        }

        if (!editingCampaignId) return;

        setIsLoadingContacts(true);
        try {
          const result = await getCampaignContacts(editingCampaignId);
          if (result.success && result.data) {
            const contactsData = result.data.items || [];
            const apiContacts = contactsData.map((contact, index) => ({
              id: `api-${contact.phone}-${index}`,
              name: contact.name || `Contact ${index + 1}`,
              phone: contact.phone,
              status: "valid",
              source: "api",
            }));
            setProcessedContacts(apiContacts);
            updateAccumulatedContacts(apiContacts);
          }
        } catch (error) {
          console.error("Error loading contacts:", error);
        } finally {
          setIsLoadingContacts(false);
        }
      };

      loadContacts();
    }
  }, [showCreateCampaignModal, createCampaignStep]); // Minimal dependencies
  // Rest of your component remains the same...
  // Calculate stats from the actual contacts
  const totalContacts = processedContacts.length;
  const contactsWithIssues = processedContacts.filter(
    (contact) => contact.status !== "valid"
  ).length;
  const successfulContacts = totalContacts - contactsWithIssues;
  const hasIssues = contactsWithIssues > 0;

  // Filter contacts based on search
  const filteredContacts = processedContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  // Pagination
  const contactsPerPage = 10;
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  const handleNext = () => {
    // Get valid contacts
    const validContacts = processedContacts.filter(
      (contact) => contact.status === "valid"
    );

    if (validContacts.length === 0) {
      alert(
        "Please ensure you have at least one valid contact before proceeding"
      );
      return;
    }

    updateFormData({
      validContacts: validContacts,
      totalContacts: processedContacts.length,
      successfulContacts: validContacts.length,
      contactsWithIssues: contactsWithIssues,
    });

    // Check if we came from summary edit
    if (editSource === "summary_contacts") {
      // Skip everything, go directly to loader then back to summary
      goToNextStep("loading");
    } else {
      // Normal flow - go to scheduling
      goToNextStep("scheduling");
    }
  };

  const handleBack = () => {
    if (isEditMode) {
      // In edit mode, go back to setup
      goToPreviousStep();
    } else {
      // In create mode, go back to the previous contact method modal
      if (contactMethod === "csv") {
        goToPreviousStep("importContacts");
      } else if (contactMethod === "existing") {
        goToPreviousStep("selectExisting");
      } else if (contactMethod === "manual") {
        goToPreviousStep("addManual");
      } else {
        goToPreviousStep("addContacts");
      }
    }
  };

  const handleAddMoreContacts = (method) => {
    setContactMethod(method);
    setShowDropdown(false);

    let targetStep;
    switch (method) {
      case "csv":
        targetStep = "importContacts";
        break;
      case "existing":
        targetStep = "selectExisting";
        break;
      case "manual":
        targetStep = "addManual";
        break;
      default:
        targetStep = "importContacts";
    }

    goToNextStep(targetStep);
  };

  const handleRemoveContact = async (contactToRemove) => {
    try {
      // Delete from backend via API - PASS THE CAMPAIGN ID
      const result = await deleteCampaignContact(
        contactToRemove.phone,
        editingCampaignId // Pass the campaign ID here
      );

      if (!result.success) {
        alert(`Failed to delete contact: ${result.error}`);
        return;
      }

      // Update local state
      const updatedContacts = processedContacts.filter(
        (contact) => contact.id !== contactToRemove.id
      );
      setProcessedContacts(updatedContacts);
      updateAccumulatedContacts(updatedContacts);
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };
  const getAlertMessage = () => {
    if (isLoadingContacts) {
      return "Loading contacts...";
    }

    if (totalContacts === 0) {
      return "No contacts found. Use the 'Add contacts' button to get started.";
    }

    return hasIssues
      ? `${successfulContacts} contacts added successfully. ${contactsWithIssues} contacts have issues — remove them if needed`
      : `${successfulContacts} contacts added successfully. Review details below before proceeding.`;
  };

  if (!showCreateCampaignModal || createCampaignStep !== "reviewContacts") {
    return null;
  }

  return (
    <Modal
      title={isEditMode ? "Edit Campaign Contacts" : "Review Uploaded Contacts"}
      onClose={closeCreateCampaignModal}
      width="max-w-[800px]"
    >
      <div className="space-y-5">
        {/* Alert Banner */}
        {showAlert && (
          <div
            className={`flex items-center justify-center gap-4 px-4 py-3 rounded-lg border mt-6 ${
              hasIssues || isLoadingContacts
                ? "bg-yellow-50 border-yellow-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                hasIssues || isLoadingContacts
                  ? "bg-yellow-100"
                  : "bg-green-100"
              }`}
            >
              {isLoadingContacts ? (
                <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
              ) : hasIssues ? (
                <div className="w-6 h-6 relative items-center justify-center flex">
                  <Image
                    src="/svgs/campaigns/issueicon.svg"
                    alt="Issue"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 relative items-center justify-center flex">
                  <Image
                    src="/svgs/campaigns/tickicon.svg"
                    alt="Success"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  hasIssues || isLoadingContacts
                    ? "text-yellow-800"
                    : "text-green-700"
                }`}
              >
                {getAlertMessage()}
              </p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className={`flex-shrink-0 ${
                hasIssues || isLoadingContacts
                  ? "text-yellow-600"
                  : "text-green-500"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search and Add Contacts Button */}
        <div className="flex items-center gap-[199px]">
          <div className="relative w-96 h-[37px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingContacts}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isLoadingContacts}
              className="flex items-center gap-2 px-3 py-2 h-[34px] border border-blue-700 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add contacts
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleAddMoreContacts("csv")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Import Contacts (CSV/XLSX)
                  </button>
                  <button
                    onClick={() => handleAddMoreContacts("existing")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Select from Existing
                  </button>
                  <button
                    onClick={() => handleAddMoreContacts("manual")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 bg-gray-50"
                  >
                    Add Manually
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoadingContacts && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Table with Contacts */}
        {!isLoadingContacts && (
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedContacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={`transition-colors ${
                      contact.status !== "valid"
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        {contact.name || "N/A"}
                      </div>
                      {contact.status !== "valid" && contact.issues && (
                        <div className="text-xs text-gray-500 mt-1">
                          {Array.isArray(contact.issues)
                            ? contact.issues.join(", ")
                            : contact.issues}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {contact.phone}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveContact(contact)}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedContacts.length === 0 && !isLoadingContacts && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No contacts found. Use the "Add contacts" button to add
                      some.
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Pagination */}
              {filteredContacts.length > 0 && (
                <tfoot>
                  <tr className="bg-white">
                    <td
                      colSpan="3"
                      className="px-4 py-3 border border-gray-200 rounded-b-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing{" "}
                          <span className="font-semibold">
                            {startIndex + 1}-
                            {Math.min(
                              startIndex + contactsPerPage,
                              filteredContacts.length
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold">
                            {filteredContacts.length}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="min-w-[32px] h-[32px] px-2 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft
                              className="w-5 h-5 text-gray-500"
                              strokeWidth={3}
                            />
                          </button>

                          {/* Page numbers */}
                          {(() => {
                            const pages = [];

                            if (totalPages <= 5) {
                              // Show all pages if 5 or fewer
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`min-w-[32px] h-[32px] px-2 text-sm font-medium transition-colors ${
                                      currentPage === i
                                        ? "bg-blue-100 text-blue-700 border border-gray-300"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }
                            } else {
                              // Show smart pagination: 1, 2, ..., last page
                              pages.push(
                                <button
                                  key={1}
                                  onClick={() => setCurrentPage(1)}
                                  className={`min-w-[32px] h-[32px] px-2 text-sm rounded font-medium transition-colors ${
                                    currentPage === 1
                                      ? "bg-blue-100 text-blue-700 border border-gray-300"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  1
                                </button>
                              );

                              if (currentPage > 2) {
                                pages.push(
                                  <button
                                    key={2}
                                    onClick={() => setCurrentPage(2)}
                                    className={`min-w-[32px] h-[32px] px-2 text-sm rounded font-medium transition-colors ${
                                      currentPage === 2
                                        ? "bg-blue-100 text-blue-700 border border-gray-300"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    2
                                  </button>
                                );
                              }

                              if (currentPage > 3) {
                                pages.push(
                                  <span
                                    key="dots1"
                                    className="px-2 text-gray-500"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              // Show current page if it's not 1, 2, or last page
                              if (currentPage > 2 && currentPage < totalPages) {
                                pages.push(
                                  <button
                                    key={currentPage}
                                    className="min-w-[32px] h-[32px] px-2 text-sm rounded font-medium bg-blue-100 text-white"
                                  >
                                    {currentPage}
                                  </button>
                                );
                              }

                              if (currentPage < totalPages - 1) {
                                pages.push(
                                  <span
                                    key="dots2"
                                    className="px-2 text-gray-500"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              pages.push(
                                <button
                                  key={totalPages}
                                  onClick={() => setCurrentPage(totalPages)}
                                  className={`min-w-[32px] h-[32px] px-2 text-sm rounded font-medium transition-colors ${
                                    currentPage === totalPages
                                      ? "bg-blue-100 text-blue-700 border border-gray-300"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {totalPages}
                                </button>
                              );
                            }

                            return pages;
                          })()}

                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="p-1.5 border min-w-[32px] h-[32px] border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight
                              className="w-5 h-5 text-gray-500"
                              strokeWidth={3}
                            />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={isLoadingContacts}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium leading-[150%] disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={successfulContacts === 0 || loading || isLoadingContacts}
            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium leading-[150%] ${
              successfulContacts === 0 || loading || isLoadingContacts
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            {isEditMode ? "Continue Editing" : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewUploadedContactsModal;
