import { ChevronDown } from "lucide-react";

const SentFrom = () => {
  return (
    <div className="mt-8">
      <h6 className="font-medium text-xs text-gray-500 mb-1">Sent From</h6>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-900">+1 786 561 7760</p>
        <ChevronDown className="size-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SentFrom;
