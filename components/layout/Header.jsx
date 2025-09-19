import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useWorkspaceStore } from "@/store/workspace/workspaceStore";

const Header = ({ onToggle, isSidebarOpen }) => {
  const { getTeamMemberAvatars } = useWorkspaceStore();
  const teamMemberAvatars = getTeamMemberAvatars();

  return (
    <header className="flex items-center justify-between bg-white px-4 h-[63px] border-b border-[#E5E7EB]">
      <div className="flex items-center gap-5">
        <button
          onClick={onToggle}
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <Image
            src="/svgs/hambarger.svg"
            alt="hambarger"
            width={18}
            height={11}
            className="cursor-pointer"
          />
        </button>
        <Image src="/svgs/logo.svg" alt="logo" width={187} height={36} />
      </div>
      <div className="flex items-center">
        <ProfileDropdown userImages={teamMemberAvatars} />
      </div>
    </header>
  );
};

export default Header;
