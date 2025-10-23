import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/global/Modal";
import useCampaignStore from "@/store/campaigns/campaignStore";
import Image from "next/image";

const AddManualContactsModal = () => {
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
    setContactMethod,
    addManualContacts,
    loading,
  } = useCampaignStore();

  const [contacts, setContacts] = useState([{ name: "", phone: "" }]);
  const [phoneErrors, setPhoneErrors] = useState({});

  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "" }]);
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
      // Remove error for deleted contact
      const newErrors = { ...phoneErrors };
      delete newErrors[index];
      setPhoneErrors(newErrors);
    }
  };

  const formatAmericanPhone = (input) => {
    // Remove all non-digit characters
    const numbers = input.replace(/\D/g, "");

    // Format based on length
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6,
        10
      )}`;
    }
  };

  const isValidAmericanPhone = (phone) => {
    // Basic phone validation - you can enhance this
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const updateContact = (index, field, value) => {
    const updatedContacts = [...contacts];

    if (field === "phone") {
      // Format the phone number as user types
      const formattedPhone = formatAmericanPhone(value);
      updatedContacts[index][field] = formattedPhone;

      // Validate and set error
      const newErrors = { ...phoneErrors };

      if (value && !isValidAmericanPhone(formattedPhone)) {
        newErrors[index] =
          "Please enter a valid US phone number (e.g., (123) 456-7890)";
      } else {
        delete newErrors[index];
      }
      setPhoneErrors(newErrors);
    } else {
      updatedContacts[index][field] = value;
    }

    setContacts(updatedContacts);
  };

  const formatPhoneForSave = (displayPhone) => {
    // Convert displayed format (232) 323-2323 to saved format +1 (232) 323-2323
    const cleanPhone = displayPhone.replace(/\D/g, "");

    // If it's already 11 digits and starts with 1, format with +1 prefix
    if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
      return `+1 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(
        4,
        7
      )}-${cleanPhone.slice(7, 11)}`;
    }

    // If it's 10 digits, add +1 prefix with formatting
    if (cleanPhone.length === 10) {
      return `+1 (${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(
        3,
        6
      )}-${cleanPhone.slice(6, 10)}`;
    }

    return `+1 ${displayPhone}`;
  };

  const handleNext = async () => {
    // Check for any phone validation errors
    const hasErrors = Object.keys(phoneErrors).length > 0;

    if (hasErrors) {
      alert("Please fix all phone number errors before proceeding.");
      return;
    }

    // Filter out empty contacts and validate
    const validContacts = contacts.filter(
      (contact) => contact.name.trim() && contact.phone.trim()
    );

    if (validContacts.length === 0) {
      alert("Please add at least one contact with name and phone number");
      return;
    }

    // Basic phone validation
    const invalidPhones = validContacts.filter(
      (contact) => !isValidAmericanPhone(contact.phone)
    );

    if (invalidPhones.length > 0) {
      alert("Some phone numbers are invalid. Please check and try again.");
      return;
    }

    // Format phones for saving with +1 prefix and American format
    const contactsForSave = validContacts.map((contact) => ({
      name: contact.name.trim(),
      phone: formatPhoneForSave(contact.phone), // This will be "+1 (232) 323-2323"
    }));

    // Create contacts with proper structure
    const contactsWithStatus = contactsForSave.map((contact, index) => ({
      id: `manual-${index}-${Date.now()}`,
      name: contact.name,
      phone: contact.phone, // Already formatted as "+1 (232) 323-2323"
      status: "valid",
      issues: null,
      source: "manual",
    }));

    // Add to backend via API
    const result = await addManualContacts(contactsForSave);

    if (!result.success) {
      alert(`Failed to add contacts: ${result.error}`);
      return;
    }

    // Update local state
    setCurrentMethodContacts(contactsWithStatus);
    addToAccumulatedContacts(contactsWithStatus);

    updateFormData({
      contactMethod: "manual",
      manualContacts: contactsForSave, // Use the +1 formatted American style contacts
      contactCount: validContacts.length,
    });

    goToNextStep("reviewContacts");
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  if (!showCreateCampaignModal || createCampaignStep !== "addManual") {
    return null;
  }

  return (
    <Modal
      title="Add Contacts Manually"
      onClose={closeCreateCampaignModal}
      width="w-[800px]"
    >
      <div className="space-y-5">
        {/* Contacts List */}
        <div className="space-y-4 mb-6">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Name Field */}
              <div className="flex-1">
                <label className="block text-gray-900 mb-2 font-medium text-sm">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  className="w-full h-[37px] px-3 py-2 text-sm font-normal bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Field */}
              <div className="flex-1">
                <label className="block text-gray-900 mb-2 font-medium text-sm">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="tel"
                      placeholder="e.g. (123) 456-7890"
                      value={contact.phone}
                      onChange={(e) =>
                        updateContact(index, "phone", e.target.value)
                      }
                      className={`w-full h-[37px] px-3 py-2 text-sm font-normal bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        phoneErrors[index]
                          ? "border-red-600 focus:ring-red-600"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {/* Error Message */}
                    {phoneErrors[index] && (
                      <p className="text-red-600 text-xs mt-1 font-medium">
                        {phoneErrors[index]}
                      </p>
                    )}
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => removeContact(index)}
                    disabled={contacts.length === 1}
                    className={`p-2 transition-colors self-start mt-1 ${
                      contacts.length === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:text-red-600"
                    }`}
                  >
                    <Image
                      src="/svgs/campaigns/deleteicon.svg"
                      alt="Delete"
                      width={11}
                      height={12}
                      className="ml-[0.5px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Client Button */}
        <button
          onClick={addContact}
          className="flex items-center gap-2 text-xs font-medium text-blue-700 hover:text-blue-800 transition-colors border border-blue-700 rounded-lg px-3 py-2"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>

        {/* Navigation Buttons - Without divider line */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              contacts.filter((c) => c.name.trim() && c.phone.trim()).length ===
                0 ||
              loading ||
              Object.keys(phoneErrors).length > 0
            }
            className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
              contacts.filter((c) => c.name.trim() && c.phone.trim()).length ===
                0 ||
              loading ||
              Object.keys(phoneErrors).length > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Adding..." : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddManualContactsModal;
