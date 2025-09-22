import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { getInitials } from "@/utils/utils";
import { X } from "lucide-react";
import { useRef } from "react";
import CiaraAiAgent from "./CiaraAiAgent";
import CopyButton from "./CopyButton";
import SentFrom from "./SentFrom";
import { ArrowDown } from "@/app/assets/svgs/icons";

const Profile = ({ setIsProfileOpen }) => {
  const conversations = useWorkspaceStore((s) => s.conversations);
  const activeConversationId = useWorkspaceStore((s) => s.activeConversationId);
  const updateConversationProfile = useWorkspaceStore(
    (s) => s.updateConversationProfile
  );

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  console.log("Active Conversation:", activeConversation, activeConversationId);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateConversationProfile(activeConversation.id, {
        profilePic: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFile = () => fileInputRef.current?.click();

  return (
    <div className="relative h-full">
      <X
        onClick={() => setIsProfileOpen(false)}
        className="absolute top-0 right-0 cursor-pointer text-gray-300"
        size={16}
      />

      {/* Profile start */}
      <div className="flex flex-col items-center pt-10">
        <div className="size-12 rounded-full bg-primary flex items-center justify-center relative">
          <span className="text-white font-medium text-xl">
            {getInitials(activeConversation.name)}
          </span>
          <div
            className={`absolute bottom-[1px] right-[1px] size-3 rounded-full border-[1.5px] border-white group cursor-pointer ${
              activeConversation.deviceType === "andriod"
                ? "bg-green-600"
                : activeConversation.deviceType === "apple"
                ? "bg-[#3F83F8]"
                : "bg-gray-300"
            }`}
          >
            <span className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-20 transition-all duration-300 ease-in-out text-nowrap">
              {activeConversation.deviceType === "andriod"
                ? "use SMS"
                : activeConversation.deviceType === "apple"
                ? "use iMessage"
                : "Unknown"}
              <span className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <ArrowDown />
              </span>
            </span>
          </div>
        </div>
        <h6 className="font-semibold text-lg text-gray-900">
          {activeConversation?.name}
        </h6>
        <div className="flex items-center gap-2">
          <p className="text-base text-gray-500">
            {activeConversation.phoneNumber}
          </p>
          <CopyButton phoneNumber={activeConversation.phoneNumber} />
        </div>
      </div>
      {/* Profile End */}

      <SentFrom />
      <CiaraAiAgent />
    </div>
  );
};

export default Profile;
