import { useOutsideClick } from "@/hooks/useOutsideClick";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

const DeleteChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  useOutsideClick(buttonRef, () => setIsOpen(false));

  const handleDeleteChat = () => {
    setIsOpen(false);
  };
  return (
    <button
      className="relative group"
      onClick={() => setIsOpen(!isOpen)}
      ref={buttonRef}
    >
      <EllipsisVertical className="size-4 text-primary" />
      {isOpen && (
        <div
          className="absolute bg-white rounded-md shadow-md w-[105px]"
          style={{ top: "20px", right: "0%", transform: "translateX(0%)" }}
        >
          <ul className="text-sm">
            <li
              onClick={handleDeleteChat}
              className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Delete chat
            </li>
          </ul>
        </div>
      )}
    </button>
  );
};

export default DeleteChat;
