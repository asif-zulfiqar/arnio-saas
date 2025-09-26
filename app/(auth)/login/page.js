"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import LoginLayout from "@/components/auth/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Mail } from "lucide-react";

const Login = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    getValues,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");

  // Simple validation rules
  const validationRules = {
    email: {
      required: "This field is required",
    },
    password: {
      required: "This field is required",
    },
  };

  // Handle email step submission
  const handleEmailSubmit = async (data) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (data.email === "user@gmail.com") {
        setError("email", {
          type: "manual",
          message: "No account found with this email",
        });
        return;
      }

      setStep(2);
    } catch (error) {
      console.error("Email validation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final form submission (password step)
  const handlePasswordSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful login here
      console.log("Login successful:", {
        email: data.email,
        password: data.password,
        rememberMe,
      });

      // Redirect or update UI state here
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  // Handle back button
  const handleBack = () => {
    setStep(1);
  };

  // Get button state for step 1 (email)
  const getEmailButtonState = () => {
    if (isLoading) {
      return {
        disabled: true,
        bgColor: "bg-gray-200",
        color: "text-gray-400",
      };
    }

    if (errors.email || !watchEmail?.trim()) {
      return {
        disabled: false,
        bgColor: "bg-blue-200",
        color: "text-blue-400",
      };
    }

    return {
      disabled: false,
      bgColor: "bg-primary hover:bg-blue-700",
      color: "text-white",
    };
  };

  // Get button state for step 2 (password)
  const getPasswordButtonState = () => {
    if (isLoading) {
      return {
        disabled: true,
      };
    }

    if (errors.password || !watchPassword?.trim()) {
      return {
        disabled: false,
        bgColor: "bg-blue-200",
        color: "text-blue-400",
      };
    }

    return {
      disabled: false,
      bgColor: "bg-primary hover:bg-blue-700",
      color: "text-white",
    };
  };

  return (
    <LoginLayout>
      <div className="max-w-[400px] w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center">
          Sign in
        </h1>

        {step === 1 && (
          <>
            <button
              onClick={handleGoogleSignIn}
              className="mt-5 md:mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-900 p-3 rounded-lg border border-gray-300 shadow-sm w-full hover:bg-gray-50 transition-colors duration-200"
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
                disabled={getEmailButtonState().disabled}
                bgColor={getEmailButtonState().bgColor}
                height="h-[41px]"
                cn="!text-sm"
              />
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <form
              onSubmit={handleSubmit(handlePasswordSubmit)}
              className="space-y-4 mt-8"
            >
              <Input
                type="email"
                value={watchEmail}
                disabled={true}
                icon={<Mail className="size-4" />}
                autoComplete="email"
                readOnly
              />

              <Input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password", validationRules.password)}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary border-[0.5px] border-gray-50 rounded-sm focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                text={isLoading ? "Signing in..." : "Continue"}
                type="submit"
                disabled={getPasswordButtonState().disabled}
                bgColor={getPasswordButtonState().bgColor}
                height="h-[41px]"
                cn="!text-sm"
              />

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-sm text-gray-600 hover:text-gray-900 mt-4"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </LoginLayout>
  );
};

export default Login;
