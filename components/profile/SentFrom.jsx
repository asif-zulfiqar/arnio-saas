import useAuthStore from "@/store/auth/authStore";

const SentFrom = ({ activeConversation }) => {
  const { user } = useAuthStore();

  const fromNumber =
    activeConversation?.fromPhoneNumber ||
    user?.assignedLines?.[0] ||
    "Not Assigned";

  return (
    <div className="mt-8">
      <h6 className="font-medium text-xs text-gray-500 mb-1">Sent From</h6>
      <div className="text-sm text-gray-900 font-medium">{fromNumber}</div>
    </div>
  );
};

export default SentFrom;
