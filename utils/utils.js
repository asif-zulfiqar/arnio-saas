const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0] ? parts[0][0].toUpperCase() : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";

  return first + last;
};

function getFirstName(name) {
  if (!name) return "";
  return name.trim().split(" ")[0];
}

function formatPhoneNumber(phone) {
  if (phone == null) return "";

  // keep only first leading '+' and digits
  let cleaned = "";
  for (const ch of String(phone).trim()) {
    const isDigit = ch >= "0" && ch <= "9";
    if (ch === "+" && cleaned.length === 0) cleaned += ch;
    else if (isDigit) cleaned += ch;
  }

  // Normalize to +1 + 10 digits (NANP)
  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  if (digits[0] === "1") {
    // has country code 1 (with or without '+')
    digits = digits.slice(1);
  } else {
    // not a +1 number → return cleaned as-is
    return cleaned;
  }

  // Use the last 10 digits for the national number (common in messy inputs)
  if (digits.length < 10) return cleaned;
  const national = digits.slice(-10);

  const a = national.slice(0, 3);
  const b = national.slice(3, 6);
  const c = national.slice(6);

  return `+1 ${a} ${b} ${c}`;
}

export { getInitials, formatPhoneNumber, getFirstName };
