"user client";
import { ArrowDown } from "@/app/assets/svgs/icons";
import { useConversationStore } from "@/store/conversation/conversationStore";
import { Info } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../global/small/Button";
import Dropdown from "../global/small/Dropdown";
import Input from "../global/small/Input";
import PhoneNumberInput from "../global/small/PhoneNumberInput";
import ToggleButton from "../global/small/ToggleButton";
import DuplicatePhone from "./DuplicatePhone";

const phoneOptions = [
  { value: "+17865617760", option: "+1 786  561 7760" },
  { value: "+12342347760", option: "+1 234  234 7760" },
];

const AddContact = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownStatus, setDropdownStatus] = useState("info");
  const [generateAIMessage, setGenerateAIMessage] = useState(false);
  const [duplicateContact, setDuplicateContact] = useState(null);
  const { addConversation, conversations, setActiveConversation } =
    useConversationStore();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleSelect = (value) => {
    console.log("Selected phone number:", value);

    if (value === "+12342347760") {
      setDropdownStatus("error");
    } else {
      setDropdownStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error("All fields are required");
    }

    const existing = conversations.find(
      (c) => c.phoneNumber === form.phone.trim()
    );

    if (existing) {
      setDuplicateContact(existing);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      addConversation(form.name.trim(), form.phone.trim(), generateAIMessage);
      onClose();
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {duplicateContact && (
        <DuplicatePhone
          duplicateContact={duplicateContact}
          onClose={onClose}
          setActiveConversation={setActiveConversation}
        />
      )}
      {!duplicateContact && (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="e.g. Jane Doe"
          />
          <PhoneNumberInput
            name="phone"
            value={form.phone}
            onChange={handlePhoneChange}
          />
          <Dropdown
            label="Choose a number to send from"
            defaultText="Select a phone"
            options={phoneOptions}
            onSelect={handleSelect}
            status={dropdownStatus}
            helperText={
              dropdownStatus === "error"
                ? "Something went wrong. Please, try again later."
                : "Your number may still be activating try again later."
            }
            cn="mt-2"
          />
          <GenerativeToggle
            isChecked={generateAIMessage}
            setIsChecked={setGenerateAIMessage}
          />
          <hr className="border-gray-200" />
          <div className="flex items-center justify-end gap-4">
            <Button
              onClick={onClose}
              text="Cancel"
              width="64px"
              color="text-gray-900"
              bgColor="bg-white"
              cn="border border-gray-200"
            />
            <Button type="submit" text="Add Contact" width="97px" />
          </div>
        </form>
      )}
    </>
  );
};

export default AddContact;

const GenerativeToggle = ({ isChecked, setIsChecked }) => {
  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };
  return (
    <div className="flex items-start justify-between gap-5">
      <div className="flex items-start gap-2">
        <ToggleButton isChecked={isChecked} onToggle={handleToggle} />
        <div>
          <h6 className="text-gray-800 text-sm">
            Generate first message with AI
          </h6>
          <p className="text-xs text-gray-500 max-w-[80%]">
            We'll draft a first message, you can edit it before sending
          </p>
        </div>
      </div>
      <div className="relative group">
        <Info className="size-4 text-gray-300 hover:text-gray-500 cursor-pointer" />

        {/* Tooltip */}
        <div className="absolute top-7 -right-5 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm w-80 z-20 transition-all duration-300 ease-in-out">
          Arnio uses AI to generate a personalized first message based on your
          automation settings
          <div className="absolute -top-2 right-5">
            <ArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
};
