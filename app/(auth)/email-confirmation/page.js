"use client";

import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import useAuthStore from "@/store/auth/authStore";
import useSignupStore from "@/store/auth/signupStore";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EmailConfirmation = () => {
  const router = useRouter();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const { email } = useSignupStore();
  const { resendVerification } = useAuthStore();

  // Redirect if no email in store
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle resend email
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError(""); // Clear any previous errors
    try {
      const result = await resendVerification(email);
      if (result.success) {
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setError(result.error || result.message || "Failed to resend email. Please try again.");
      }
    } catch (error) {
      console.error("Resend email failed:", error);
      setError(error.message || error.response?.data?.message || "Failed to resend email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Handle change email
  const handleChangeEmail = () => {
    router.push("/signup");
  };

  return (
    <SignupLayout step={1}>
      <div className="w-full space-y-5">
        <h1 className="text-3xl text-center font-semibold text-gray-900">
          Check your inbox
        </h1>
        <p className="text-sm text-gray-500 mx-auto text-center max-w-xs">
          We've sent a verification code to your email. Enter the code below to verify your account.
        </p>

        <div className="space-y-6">
          {/* Email display */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{email}</span>
            </div>
          </div>

          {/* Resend and Change Email */}
          <div className="space-y-3">
            {error && (
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <Button
              text={resendLoading ? "Sending..." : resendCooldown > 0 ? `Resend email (${resendCooldown}s)` : "Resend email"}
              onClick={handleResendEmail}
              disabled={resendLoading || resendCooldown > 0}
              height="h-[41px]"
              cn="!text-sm border border-gray-200"
              color={resendLoading || resendCooldown > 0 ? "text-gray-400" : "text-gray-900"}
              bgColor={resendLoading || resendCooldown > 0 ? "bg-gray-200" : "bg-transparent"}
            >
              {resendLoading 
                ? "Sending..." 
                : resendCooldown > 0 
                  ? `Resend email (${resendCooldown}s)` 
                  : "Resend email"
              }
            </Button>
            
            <button
              onClick={handleChangeEmail}
              className="w-full text-sm text-gray-600 hover:text-gray-900 text-center"
            >
              Change email
            </button>
          </div>
        </div>

        {/* Footer */}
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
      </div>
    </SignupLayout>
  );
};

export default EmailConfirmation;
