"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "react-phone-number-input/style.css";

const PhoneNumberInput = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (val) => {
    if (!val) {
      setInternalValue("");
      onChange("");
      return;
    }

    // Optional: normalize + format cleanly using libphonenumber-js
    let formatted = val;
    try {
      const phoneNumber = parsePhoneNumberFromString(val);
      if (phoneNumber) {
        formatted = phoneNumber.formatInternational();
      }
    } catch (e) {
      console.warn("Invalid phone input:", e.message);
    }

    setInternalValue(formatted);
    onChange(formatted);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-900">Phone Number</label>
      <PhoneInput
        international
        defaultCountry="US" // still defaults to US, but user can change
        value={internalValue}
        onChange={handleChange}
        placeholder="+1 202 444 3233"
        className="mt-2 px-4 h-[42px] border border-gray-300 bg-gray-50 rounded-lg w-full text-sm text-gray-900"
      />
    </div>
  );
};

export default PhoneNumberInput;
