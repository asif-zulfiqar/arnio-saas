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

function formatMessageDate(timestamp) {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours = Math.abs(now - messageDate) / (1000 * 60 * 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const timeString = messageDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffInDays === 0) {
    return `Today ${timeString}`;
  } else if (diffInDays === 1) {
    return `Yesterday ${timeString}`;
  } else if (diffInDays < 7) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return `${dayName} ${timeString}`;
  } else {
    return (
      messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: diffInDays > 365 ? "numeric" : undefined,
      }) + ` ${timeString}`
    );
  }
}

function shouldShowTimestamp(currentMsg, index, messages) {
  if (index === 0) return true;

  const prevMsg = messages[index - 1];
  const currentTime = new Date(currentMsg.timestamp);
  const prevTime = new Date(prevMsg.timestamp);

  // Show timestamp if more than 1 hour difference
  const hoursDiff = Math.abs(currentTime - prevTime) / (1000 * 60 * 60);
  return hoursDiff >= 1;
}

export {
  getInitials,
  formatPhoneNumber,
  getFirstName,
  formatMessageDate,
  shouldShowTimestamp,
};
