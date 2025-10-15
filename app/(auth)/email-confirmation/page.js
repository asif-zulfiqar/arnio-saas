"use client";

import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import Link from "next/link";

const EmailConfirmation = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { email, setCurrentStep } = useSignupStore();
  const { resendVerification } = useAuthStore();

  // Redirect if no email in store
  // useEffect(() => {
  //   if (!email) {
  //     router.push("/signup");
  //   }
  // }, [email, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      // TODO: Integrate with email verification API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Navigate to profile creation page
      setCurrentStep(2);
      router.push("/create-profile");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend email
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    try {
      const result = await resendVerification(email);
      if (result.success) {
        setResendCooldown(60); // 60 seconds cooldown
      }
    } catch (error) {
      console.error("Resend email failed:", error);
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
      <div className="w-full">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-gray-500 mb-8">
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

          {/* OTP Input */}
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputType="tel"
                renderInput={(props) => (
                  <input
                    {...props}
                    className="!size-12 mr-3 !text-lg !font-semibold !text-gray-900 text-center border !border-gray-200 !rounded-lg !focus:outline-none !focus:border-primary"
                  />
                )}
              />
            </div>

          {/* Verify Button */}
          <Button
            text={isLoading ? "Verifying..." : "Verify"}
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.length !== 6}
            height="h-[41px]"
            cn="!text-sm"
          />

          {/* Resend and Change Email */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full text-sm text-gray-600 hover:text-gray-900 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading 
                ? "Sending..." 
                : resendCooldown > 0 
                  ? `Resend email (${resendCooldown}s)` 
                  : "Resend email"
              }
            </button>
            
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
