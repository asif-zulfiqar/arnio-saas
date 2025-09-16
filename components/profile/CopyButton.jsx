import { Copy, Check, CircleCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CopyButton = ({ phoneNumber }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="transition-colors"
      title="Copy phone number"
    >
      {copied ? (
        <CircleCheck
          size={16}
          className="text-primary transition-transform duration-300 scale-110"
        />
      ) : (
        <button>
          <Image src="/svgs/copy-icon.svg" width={11} height={14} alt="icon" />
        </button>
      )}
    </button>
  );
};

export default CopyButton;
