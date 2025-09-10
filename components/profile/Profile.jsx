import { X } from "lucide-react";

const Profile = ({ setIsProfileOpen }) => {
  return (
    <div className="relative h-full">
      <X
        onClick={() => setIsProfileOpen(false)}
        className="absolute top-0 right-0 cursor-pointer text-gray-300"
        size={16}
      />
    </div>
  );
};

export default Profile;
