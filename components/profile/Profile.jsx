import { X } from "lucide-react";
import SentFrom from "./SentFrom";
import CiaraAiAgent from "./CiaraAiAgent";
import Notes from "./Notes";
import Files from "./Files";

const Profile = ({ setIsProfileOpen }) => {
  return (
    <div className="relative h-full">
      <X
        onClick={() => setIsProfileOpen(false)}
        className="absolute top-0 right-0 cursor-pointer text-gray-300"
        size={16}
      />

      {/* Profile start */}
      {/* Profile End */}

      <SentFrom />
      <CiaraAiAgent />
      <Notes />
      <Files />
    </div>
  );
};

export default Profile;
