import { Camera, X } from "lucide-react";
import CiaraAiAgent from "./CiaraAiAgent";
import SentFrom from "./SentFrom";
import Image from "next/image";
import { useConversationStore } from "@/store/conversation/conversationStore";
import { useRef } from "react";
import CopyButton from "./CopyButton";

const Profile = ({ setIsProfileOpen }) => {
  const conversations = useConversationStore((s) => s.conversations);
  const activeConversationId = useConversationStore(
    (s) => s.activeConversationId
  );
  const updateConversationProfile = useConversationStore(
    (s) => s.updateConversationProfile
  );

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

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
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border shadow-sm">
            {activeConversation.profilePic ? (
              <Image
                src={activeConversation.profilePic}
                alt={activeConversation.name}
                width={48}
                height={48}
                className="object-cover w-12 h-12"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                {activeConversation.name?.[0] || "U"}
              </div>
            )}
          </div>
          <button
            onClick={triggerFile}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/25 opacity-0 hover:opacity-100 transition-opacity"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
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
