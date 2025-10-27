import Image from "next/image";
import Link from "next/link";

const LoginLayout = ({ children }) => {
  return (
    <section className="min-h-screen w-screen bg-white flex flex-col items-center justify-between gap-5 md:gap-10 py-[40px] px-4">
      <Link href="/">
        <Image
          src="/images/arnio-logo.png"
          alt="Arnio Logo"
          width={118}
          height={48}
        />
      </Link>
      {children}
      <div>
        <h6 className="text-sm font-medium text-gray-900 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary">
            Sign up here
          </Link>
        </h6>
        <p className="mt-4 text-sm text-gray-500 text-center max-w-[384px]">
          By proceeding you acknowledge that you have read, understood and agree
          to our{" "}
          <Link
            href="https://arnio.co/legals/terms-of-service"
            target="_blank"
            className="border-b border-gray-500"
          >
            Terms and Conditions
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginLayout;
