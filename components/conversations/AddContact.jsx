"user client";
import { Info } from "lucide-react";
import { useState } from "react";
import Button from "../global/small/Button";
import Dropdown from "../global/small/Dropdown";
import Input from "../global/small/Input";
import ToggleButton from "../global/small/ToggleButton";
import { ArrowDown } from "@/app/assets/svgs/icons";

const phoneOptions = [
  { value: "+17865617760", option: "+1 786  561 7760" },
  { value: "+12342347760", option: "+1 234  234 7760" },
];

const AddContact = ({ onClose }) => {
  const handleSelect = (value) => {
    console.log("Selected phone number:", value);
  };
  return (
    <form className="space-y-5">
      <Input label="Name" placeholder="e.g. Jane Doe" />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="e.g. +1 123 456 7890"
      />
      <Dropdown
        label="Choose a number to send from"
        defaultText="Select a phone"
        options={phoneOptions}
        onSelect={handleSelect}
      />
      <GenerativeToggle />
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
  );
};

export default AddContact;

const GenerativeToggle = () => {
  const [isChecked, setIsChecked] = useState(false);
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
