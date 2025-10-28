import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import useAuthStore from "@/store/auth/authStore";
import { getInitials } from "@/utils/utils";

const Header = ({ onToggle, isSidebarOpen }) => {
  const { user } = useAuthStore();
  const companyLogo = user?.workspaces?.[0]?.companyLogo || null;

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
        <div className="flex items-center gap-3">
          {companyLogo && companyLogo.startsWith("http") ? (
            <Image
              src={companyLogo}
              alt="Company logo"
              width={160}
              height={40}
              className="object-contain max-h-10 w-auto"
              priority
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                {getInitials(user?.workspaces?.[0]?.companyName)}
              </span>
            </div>
          )}
          { user?.workspaces?.[0]?.companyName || '' }
        </div>
      </div>
      <div className="flex items-center">
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
