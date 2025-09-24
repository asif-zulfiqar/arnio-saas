import LoginLayout from "@/components/auth/LoginLayout";
import Image from "next/image";

const Login = () => {
  return (
    <LoginLayout>
      <div className="max-w-[400px] w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center">
          Sign in
        </h1>
        <button className="mt-5 md:mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-900 p-3 rounded-lg border border-gray-50 shadow-sm w-full">
          <Image
            src="/svgs/google-icon.svg"
            alt="icon"
            width={20}
            height={20}
          />
          Sign in with Google
        </button>
      </div>
    </LoginLayout>
  );
};

export default Login;
