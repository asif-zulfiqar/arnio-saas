"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import SignupLayout from "@/components/auth/SignupLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Mail } from "lucide-react";
import useSignupStore from "@/store/auth/signupStore";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, setGoogleAuthUsed, setCurrentStep } = useSignupStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const watchEmail = watch("email");

  // Validation rules
  const validationRules = {
    email: {
      required: "This field is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
  };

  // Handle email submission
  const handleEmailSubmit = async (data) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store email in Zustand store
      setEmail(data.email);
      setGoogleAuthUsed(false);

      // Navigate to workspace step
      setCurrentStep(2);
      router.push("/workspace");
    } catch (error) {
      console.error("Email validation failed:", error);
      setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign up
  const handleGoogleSignUp = async () => {};

  return (
    <section className="py-10 pb-12 min-h-screen w-screen bg-white flex flex-col">
      <Image
        src="/images/arnio-logo.png"
        alt="Arnio Logo"
        width={118}
        height={48}
        className="mx-auto mb-10"
      />
      <SignupLayout step={1}>
        <div className="w-full">
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="mt-5 md:mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-900 p-3 rounded-lg border border-gray-50 shadow-sm w-full hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/svgs/google-icon.svg"
              alt="icon"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>

          <div className="relative my-8">
            <hr className="border-gray-200" />
          </div>

          <form
            onSubmit={handleSubmit(handleEmailSubmit)}
            className="space-y-5"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="size-4" />}
              autoComplete="email"
              error={errors.email?.message}
              {...register("email", validationRules.email)}
            />

            <Button
              text={isLoading ? "Checking..." : "Continue"}
              type="submit"
              disabled={isLoading || !watchEmail || errors.email}
              // bgColor={getButtonState().bgColor}
              height="h-[41px]"
              cn="!text-sm"
            />
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-500 text-center">
              By entering your email, you agree to Arnio contacting you about
              our products and services. You can unsubscribe at any time by
              clicking the link in our emails. Learn more about how we use your
              data in our{" "}
              <Link href="#" className="text-primary hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </SignupLayout>
    </section>
  );
};

export default Signup;
