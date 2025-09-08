import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[998] w-screen h-screen bg-white text-black font-bold grid place-items-center">
      <div className="animate-ping">
        <Image
          src="/svgs/logo-icon.svg"
          width={32}
          height={32}
          alt="logo icon"
        />
      </div>
    </div>
  );
};

export default Loader;
