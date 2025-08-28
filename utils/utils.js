const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0] ? parts[0][0].toUpperCase() : "";
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";

  return first + last;
};

export { getInitials };
