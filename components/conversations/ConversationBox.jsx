import { Plus } from "lucide-react";
import Image from "next/image";
import Modal from "../global/Modal";
import { useState } from "react";
import AddContact from "./AddContact";

const ConversationBox = ({ onStartConversation }) => {
  return (
    <div className="flex-1 w-full grid place-items-center">
      <div>
        <Image
          src="/svgs/empty.svg"
          width={234}
          height={228}
          alt="No conversations"
        />
        <h5 className="text-gray-900 text-base font-medium text-center mt-5">
          No conversations yet
        </h5>
        <p className="text-gray-400 text-sm text-center mt-1">
          Start a new chat to begin messaging.
        </p>
        <button
          onClick={onStartConversation}
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[210px] h-[34px] mx-auto"
        >
          <Plus className="size-[10px] text-primary" />
          Start Your First Conversation
        </button>
      </div>
    </div>
  );
};

export default ConversationBox;
