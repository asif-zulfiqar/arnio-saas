import PhoneInput from "react-phone-number-input/input";

const PhoneNumberInput = ({ value, onChange }) => {
  const handleChange = (val) => {
    // Only allow US numbers (10 digits max)
    if (!val || val.length <= 12) {
      // +1 + 10 digits = 12 chars max
      onChange(val || "");
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-900">Phone Number</label>
      <PhoneInput
        country="US"
        value={value}
        onChange={handleChange}
        maxLength={14}
        placeholder="(234) 567-8901"
        className="mt-2 outline-none px-4 h-[42px] border border-gray-300 bg-gray-50 rounded-lg w-full text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary"
        style={{
          "--PhoneInputCountryFlag-height": "1em",
          "--PhoneInputCountrySelectArrow-color": "#6b7280",
        }}
      />
    </div>
  );
};

export default PhoneNumberInput;
