"use client";

import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, setGoogleAuthUsed, setCurrentStep } = useSignupStore();
  const { register: registerUser } = useAuthStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirmPassword");

  // Clear general errors when user starts typing
  useEffect(() => {
    if (errors.general) {
      clearErrors("general");
    }
  }, [
    watchEmail,
    watchPassword,
    watchConfirmPassword,
    errors.general,
    clearErrors,
  ]);

  // Validation rules
  const validationRules = {
    email: {
      required: "This field is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) => {
        if (value !== watchPassword) {
          return "Passwords do not match";
        }
        return true;
      },
    },
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Call register API
      const result = await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: "", // Will be filled in profile creation
        lastName: "", // Will be filled in profile creation
        phone: "", // Will be filled in profile creation
        companyName: "", // Will be filled in workspace creation
      });

      if (result.success) {
        // Store email in Zustand store
        setEmail(data.email);
        setGoogleAuthUsed(false);

        // Navigate to email confirmation page
        router.push("/email-confirmation");
      } else {
        setError("general", {
          type: "manual",
          message: result.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("general", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign up
  const handleGoogleSignUp = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.arnio.co/api/v1";
    const googleAuthUrl = `${baseUrl}/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <SignupLayout step={1}>
      <div className="w-full">
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900 p-3 rounded-lg border border-gray-50 shadow-sm w-full hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <Input
            type="email"
            placeholder="Enter your email"
            icon={<Mail className="size-4" />}
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", validationRules.email)}
          />

          <Input
            type="password"
            placeholder="Create Password"
            icon={<Lock className="size-4" />}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password", validationRules.password)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            icon={<Lock className="size-4" />}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", validationRules.confirmPassword)}
          />

          {errors.general && (
            <p className="text-sm text-red-600 text-center">
              {errors.general.message}
            </p>
          )}

          <Button
            text={isLoading ? "Creating Account..." : "Continue"}
            type="submit"
            disabled={
              isLoading ||
              !watchEmail ||
              !watchPassword ||
              !watchConfirmPassword
            }
            height="h-[41px]"
            cn="!text-sm"
          />
          <h6 className="text-sm font-medium text-gray-900 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </h6>
        </form>
      </div>
    </SignupLayout>
  );
};

export default Signup;
