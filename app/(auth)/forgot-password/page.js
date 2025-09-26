"use client";
import LoginLayout from "@/components/auth/LoginLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchEmail = watch("email");

  // Simple validation rules
  const validationRules = {
    email: {
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

  return (
    <LoginLayout>
      <div className="max-w-[400px] w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center mb-8">
          {step === 1 ? "Forgot Password" : "Success!"}
        </h1>

        {step === 1 && (
          <>
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
                text={isLoading ? "Sending..." : "Send Reset Link"}
                type="submit"
                disabled={getEmailButtonState().disabled}
                bgColor={getEmailButtonState().bgColor}
                height="h-[41px]"
                cn="!text-sm"
              />
              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 text-center w-full block hover:underline"
              >
                Back to Sign in{" "}
              </Link>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-base text-gray-600 text-center mb-6">
              We’ve sent a password reset link to your email
            </p>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 text-center w-full block hover:underline"
            >
              <Button text="Back to Sign in" height="h-[41px]" cn="!text-sm" />
            </Link>
          </>
        )}
      </div>
    </LoginLayout>
  );
};

export default ForgotPassword;
