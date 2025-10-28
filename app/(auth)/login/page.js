"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import LoginLayout from "@/components/auth/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Mail } from "lucide-react";
import useAuthStore from "@/store/auth/authStore";

const Login = () => {
  const router = useRouter();
  const { login, googleLogin, isLoading, enableRememberMe } = useAuthStore();
  const [step, setStep] = useState(1);
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
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");
  
  // Track previous values to detect actual user input changes
  const prevEmailRef = useRef(watchEmail);
  const prevPasswordRef = useRef(watchPassword);

  // Clear general errors only when user actually changes input values
  useEffect(() => {
    if (errors.general && (watchEmail !== prevEmailRef.current || watchPassword !== prevPasswordRef.current)) {
      clearErrors("general");
    }
    prevEmailRef.current = watchEmail;
    prevPasswordRef.current = watchPassword;
  }, [watchEmail, watchPassword, errors.general, clearErrors]);

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
    try {
      // For now, just move to password step
      // In a real app, you might want to validate if email exists
      setStep(2);
    } catch (error) {
      console.error("Email validation failed:", error);
      setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // Handle final form submission (password step)
  const handlePasswordSubmit = async (data) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // If remember me is checked, enable it
        if (rememberMe) {
          try {
            await enableRememberMe();
          } catch (rememberMeError) {
            console.error('Remember me failed:', rememberMeError);
            // Don't block login if remember me fails
          }
        }

        // Check user onboarding status and redirect directly to appropriate step
        const user = result.user;
        
        // Small delay to prevent page flash, then navigate
        setTimeout(() => {
          if (user && user.isOnboarded) {
            // User is onboarded - go to dashboard
            router.push('/');
          } else {
            // User needs to complete onboarding - redirect directly to appropriate step
            const hasProfile = user.firstName && user.lastName && user.phone;
            const hasWorkspace = user.workspaces && user.workspaces.length > 0;
            
            if (hasWorkspace && hasProfile) {
              router.push('/team-members');
            } else if (hasWorkspace) {
              router.push('/create-profile');
            } else {
              router.push('/create-profile');
            }
          }
        }, 100);
      } else {
        // Handle login failure - clear any existing errors first
        clearErrors("general");
        setError("general", {
          type: "manual",
          message: result.error || result.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Clear any existing errors first
      clearErrors("general");
      setError("general", {
        type: "manual",
        message: error.message || error.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.arnio.co/api/v1";
    const googleAuthUrl = `${baseUrl}/google`;
    window.location.href = googleAuthUrl;
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
        bgColor: "bg-primary/80",
      };
    }

    if (errors.email || !watchEmail?.trim()) {
      return {
        disabled: false,
        bgColor: "bg-primary/80",
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
        bgColor: "bg-primary/80",
      };
    }

    if (errors.password || !watchPassword?.trim()) {
      return {
        disabled: false,
        bgColor: "bg-primary/80",
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
              className="mt-5 md:mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-900 p-3 rounded-lg border border-gray-50 shadow-sm w-full hover:bg-gray-50 transition-colors duration-200"
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

              {errors.general && (
                <p className="text-sm text-red-600 text-center mt-4">
                  {errors.general.message}
                </p>
              )}
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

              {errors.general && (
                <p className="text-sm text-red-600 text-center mt-4">
                  {errors.general.message}
                </p>
              )}

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
