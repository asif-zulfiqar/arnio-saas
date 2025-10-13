"use client";
import LoginLayout from "@/components/auth/LoginLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import useAuthStore from "@/store/auth/authStore";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { forgotPassword, resetPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
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

  // Clear general errors when user starts typing
  useEffect(() => {
    if (errors.general) {
      clearErrors("general");
    }
  }, [watchEmail, errors.general, clearErrors]);

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
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setEmail(data.email);
        setStep(2);
      } else {
        setError("email", {
          type: "manual",
          message: result.error || "Failed to send reset OTP",
        });
      }
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

  // Handle OTP and new password submission
  const handleResetPassword = async (data) => {
    if (otp.length !== 6) return;

    setIsLoading(true);

    try {
      const resetData = {
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const result = await resetPassword(resetData);
      
      if (result.success) {
        setStep(3); // Success step
      } else {
        setError("general", {
          type: "manual",
          message: result.error || "Password reset failed",
        });
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setError("general", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get button state for step 1 (email)
  const getEmailButtonState = () => {
    if (isLoading) {
      return {
        disabled: true,
        bgColor: "bg-primary/80",
      };
    }

    if (!watchEmail?.trim()) {
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
          {step === 1 ? "Forgot Password" : step === 2 ? "Reset Password" : "Success!"}
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
                text={isLoading ? "Sending..." : "Send Reset OTP"}
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
              We've sent a verification code to {email}. Enter the code and your new password below.
            </p>
            
            <form
              onSubmit={handleSubmit(handleResetPassword)}
              className="space-y-5"
            >
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
                        className="!size-12 mr-2 !text-lg !font-semibold !text-gray-900 text-center border !border-gray-200 !rounded-lg !focus:outline-none !focus:border-primary"
                      />
                    )}
                  />
                </div>

              <Input
                type="password"
                placeholder="New Password"
                icon={<Mail className="size-4" />}
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />

              <Input
                type="password"
                placeholder="Confirm New Password"
                icon={<Mail className="size-4" />}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => {
                    if (value !== watch("newPassword")) {
                      return "Passwords do not match";
                    }
                    return true;
                  },
                })}
              />

              {errors.general && (
                <p className="text-sm text-red-600 text-center">
                  {errors.general.message}
                </p>
              )}

              <Button
                text={isLoading ? "Resetting..." : "Reset Password"}
                type="submit"
                disabled={isLoading || otp.length !== 6}
                height="h-[41px]"
                cn="!text-sm"
              />
              
              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 text-center w-full block hover:underline"
              >
                Back to Sign in
              </Link>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-base text-gray-600 text-center mb-6">
              Your password has been reset successfully! You can now sign in with your new password.
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
