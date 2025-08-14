import Image from "next/image";
const userImages = [
  "/images/user1.jpg",
  "/images/user2.jpg",
  "/images/user3.jpg",
  "/images/user4.jpg",
];

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-4 lg:px-5 h-[63px] border-b border-[#E5E7EB]">
      <div className="flex items-center gap-5 lg:gap-6">
        <Image
          src="/svgs/hambarger.svg"
          alt="hambarger"
          width={18}
          height={11}
          className="cursor-pointer"
        />
        <Image src="/svgs/logo.svg" alt="logo" width={187} height={36} />
      </div>
      <div className="flex items-center">
        {userImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="user image"
            width={32}
            height={32}
            className={
              "size-[32px] rounded-full object-cover -ml-2 border-2 border-white"
            }
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
