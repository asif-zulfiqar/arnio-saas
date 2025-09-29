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

    // Always force prefix +1 and strip non-digits
    let digits = val.replace(/\D/g, "");
    if (!digits.startsWith("1")) {
      digits = "1" + digits; // force US country code
    }

    // Limit to 11 digits max
    digits = digits.slice(0, 11);
    const normalized = `+${digits}`;

    // Format once 11 digits are present
    let formatted = normalized;
    if (digits.length === 11) {
      try {
        const phoneNumber = parsePhoneNumberFromString(normalized, "US");
        if (phoneNumber) {
          formatted = phoneNumber.formatInternational();
        }
      } catch {
        console.log("user entered more than 11 numbers");
      }
    }

    setInternalValue(formatted);
    onChange(formatted);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-900">Phone Number</label>
      <PhoneInput
        defaultCountry="US"
        countries={["US"]}
        international
        withCountryCallingCode
        value={internalValue}
        onChange={handleChange}
        placeholder="+1 202 444 3233"
        className="mt-2 px-4 h-[42px] border border-gray-300 bg-gray-50 rounded-lg w-full text-sm text-gray-900"
      />
    </div>
  );
};

export default PhoneNumberInput;
