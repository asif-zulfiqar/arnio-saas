import Image from "next/image";
import Link from "next/link";

const SignupLayout = ({ children, step = 1 }) => {
  const getRightSideContent = () => {
    switch (step) {
      case 1: // Signup page
        return (
          <div className="flex flex-col justify-center items-center text-center px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Arnio
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Arnio is the AI-powered iMessage sales platform for eCommerce.
              Every customer deserves to feel like your favorite—and with Arnio,
              brands can make that happen. Send or approve AI-drafted texts,
              drop new products, follow up with shoppers, and track what drives
              sales: replies, conversions, and repeat purchases.
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-8">
              The only iMessage sales platform built for eCommerce brands.
            </p>
            <p className="text-lg text-gray-600">Let's get started.</p>
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
    <section className="flex-1 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Content/Images */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center">
        {getRightSideContent()}
      </div>
    </section>
  );
};

export default SignupLayout;
