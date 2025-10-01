import Image from "next/image";
import Link from "next/link";

const SignupLayout = ({ children, step = 1 }) => {
  const getRightSideContent = () => {
    switch (step) {
      case 1: // Signup page
        return (
          <div className="flex flex-col justify-center w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to Arnio
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Arnio is the AI-powered iMessage sales platform for eCommerce.
              Every customer deserves to feel like your favorite—and with Arnio,
              brands can make that happen. Send or approve AI-drafted texts,
              drop new products, follow up with shoppers, and track what drives
              sales: replies, conversions, and repeat purchases. <br /> <br />
              The only iMessage sales platform built for eCommerce brands.
              <br /> <br />
              Let’s get started.
            </p>
          </div>
        );

      case 2: // Workspace page
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Meadowfield Chat
                </h3>
                <p className="text-gray-600 text-sm">
                  Preview of your chat workspace
                </p>
              </div>
            </div>
          </div>
        );

      case 3: // Team members page
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your team members
                </p>
              </div>
            </div>
          </div>
        );

      case 4: // Preferences page
        return (
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customer Success
                </h3>
                <p className="text-gray-600 text-sm">
                  Happy customers with great products
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-10 pb-12 min-h-screen w-screen bg-white flex flex-col">
      <Image
        src="/images/arnio-logo.png"
        alt="Arnio Logo"
        width={118}
        height={48}
        className="mx-auto mb-10"
      />
      <section className="flex-1 flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full max-w-lg">{children}</div>
          {step === 1 && (
            <div className="absolute bottom-0 w-full max-w-lg">
              <p className="text-[10px] text-gray-500">
                By entering your email, you agree to Arnio contacting you about
                our products and services. You can unsubscribe at any time by
                clicking the link in our emails. Learn more about how we use
                your data in our{" "}
                <Link href="#" className="underline">
                  privacy policy
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Right side - Content/Images */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center">
          {getRightSideContent()}
        </div>
      </section>
    </section>
  );
};

export default SignupLayout;
