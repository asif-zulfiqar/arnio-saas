import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";

const SelectExistingContactsModal = () => {
  const {
    showCreateCampaignModal,
    createCampaignStep,
    closeCreateCampaignModal,
    goToNextStep,
    goToPreviousStep,
    addToAccumulatedContacts,
    setContactMethod,
    getExistingContacts,
    addExistingContactsByIds,
    loading,
  } = useCampaignStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [existingContacts, setExistingContacts] = useState([]);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load existing contacts on component mount
  useEffect(() => {
    const loadContacts = async () => {
      const result = await getExistingContacts();
      if (result.success) {
        setExistingContacts(result.data.items || []);
      }
    };
    loadContacts();
  }, [getExistingContacts]);

  const handleNext = async () => {
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact");
      return;
    }

    // Add to backend via API
    const result = await addExistingContactsByIds(selectedContacts);

    if (!result.success) {
      alert(`Failed to add contacts: ${result.error}`);
      return;
    }

    const selectedContactData = existingContacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );

    // Mark all existing contacts as valid and add source
    const contactsWithStatus = selectedContactData.map((contact) => ({
      ...contact,
      status: "valid",
      source: "existing",
    }));

    // Add to accumulated contacts in store
    addToAccumulatedContacts(contactsWithStatus);

    // Set contact method
    setContactMethod("existing");

    goToNextStep("reviewContacts");
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const toggleContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    }
  };

  const filteredContacts = existingContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  const isAllSelected =
    selectedContacts.length === filteredContacts.length &&
    filteredContacts.length > 0;

  if (!showCreateCampaignModal || createCampaignStep !== "selectExisting") {
    return null;
  }

  return (
    <Modal
      title="Select from Existing"
      onClose={closeCreateCampaignModal}
      width="w-[800px]"
    >
      <div className="space-y-5">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 leading-[150%]">
            Select from existing contacts
          </label>

          {/* Dropdown Trigger */}
          <div className="relative">
            <button
              ref={triggerRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-[42px] px-4 py-3 bg-gray-50 border border-blue-600 rounded-lg text-left text-sm font-normal text-gray-900 leading-[125%] hover:bg-gray-50 transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span
                className={
                  selectedContacts.length === 0
                    ? "text-gray-500"
                    : "text-gray-900"
                }
              >
                {selectedContacts.length === 0
                  ? "Choose contact(s)..."
                  : `${selectedContacts.length} contact(s) selected`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu - Fixed to break out of modal container */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{
                  // Calculate position based on trigger element
                  top: `${
                    triggerRef.current?.getBoundingClientRect().bottom + 8
                  }px`,
                  left: `${triggerRef.current?.getBoundingClientRect().left}px`,
                  width: "735px",
                  height: "377px",
                }}
              >
                {/* Search Inside Dropdown */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative w-full h-[37px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg text-sm font-normal text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Select All Option */}
                <div className="">
                  <label className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="appearance-none w-4 h-4 border-1 border-gray-300 rounded-sm bg-white cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                    />
                    <span className="ms-2 text-sm font-semibold text-gray-900">
                      Select All
                    </span>
                  </label>
                </div>

                {/* Contacts List with Fixed Height Scroll */}
                <div
                  className="overflow-y-auto  
                   [&::-webkit-scrollbar]:w-1.5 
                  [&::-webkit-scrollbar-thumb]:bg-gray-400 
                  [&::-webkit-scrollbar-thumb]:rounded-full 
                  [&::-webkit-scrollbar-track]:bg-transparent"
                  style={{ height: "calc(377px - 69px - 44px)" }}
                >
                  {filteredContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center pl-10 pr-4 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="appearance-none w-4 h-4 border-1 border-gray-300 rounded-sm bg-white cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                      />
                      <div className="flex w-full ms-3 items-center">
                        <span className="text-sm font-normal text-gray-900 w-[135px] truncate">
                          {contact.name}
                        </span>
                        <span className="text-sm font-normal text-gray-500 ms-6">
                          {contact.phone}
                        </span>
                      </div>
                    </label>
                  ))}

                  {filteredContacts.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No contacts found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleBack}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium leading-[150%]"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedContacts.length === 0 || loading}
            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium leading-[150%] ${
              selectedContacts.length === 0 || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding..." : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectExistingContactsModal;
