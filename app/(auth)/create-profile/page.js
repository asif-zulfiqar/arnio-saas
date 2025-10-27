"use client";

import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const CreateProfile = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const { setCurrentStep } = useSignupStore();
  const { updateProfile, getProfile } = useAuthStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");

  // Track previous values to detect actual user input changes
  const prevFirstNameRef = useRef(watchFirstName);
  const prevLastNameRef = useRef(watchLastName);

  // Clear general errors only when user actually changes input values
  useEffect(() => {
    if (
      errors.general &&
      (watchFirstName !== prevFirstNameRef.current ||
        watchLastName !== prevLastNameRef.current)) {
      clearErrors("general");
    }
    prevFirstNameRef.current = watchFirstName;
    prevLastNameRef.current = watchLastName;
  }, [watchFirstName, watchLastName, errors.general, clearErrors]);

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log("Profile response:", response); // Debug log

        // Handle different response structures
        const profile = response?.data || response?.user || response;

        if (profile) {
          // Populate form with existing data
          setValue("firstName", profile.firstName || "");
          setValue("lastName", profile.lastName || "");

          // Set avatar if exists
          if (profile.avatar || profile.avatarUrl) {
            setAvatarPreview(profile.avatar || profile.avatarUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [getProfile, setValue]);

  // Validation rules
  const validationRules = {
    firstName: {
      required: "First name is required",
      minLength: {
        value: 2,
        message: "First name must be at least 2 characters",
      },
    },
    lastName: {
      required: "Last name is required",
      minLength: {
        value: 2,
        message: "Last name must be at least 2 characters",
      },
    },
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("avatar", {
          type: "manual",
          message: "File size must be under 5MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("avatar", {
          type: "manual",
          message: "Please upload a valid image file",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove profile picture
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    // Clear any avatar-related errors
    clearErrors("avatar");
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Prepare profile data for API
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: avatarFile, // File object for upload
      };

      console.log("Profile data being sent:", profileData); // Debug log

      // Call update profile API
      const result = await updateProfile(profileData);

      if (result.success) {
        // Navigate to workspace creation
        setCurrentStep(3);
        setTimeout(() => {
          router.push("/workspace");
        }, 100);
      } else {
        // Clear any existing errors first
        clearErrors("general");
        setError("general", {
          type: "manual",
          message:
            result.error ||
            result.message ||
            "Profile update failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      // Clear any existing errors first
      clearErrors("general");
      setError("general", {
        type: "manual",
        message:
          error.message ||
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get button state
  const getButtonState = () => {
    if (isLoading) {
      return {
        disabled: true,
        bgColor: "bg-primary/80",
        color: "text-white",
      };
    }

    if (
      !watchFirstName?.trim() ||
      !watchLastName?.trim() ||
    ) {
      return {
        disabled: true,
        bgColor: "bg-primary/80",
        color: "text-white",
      };
    }

    return {
      disabled: false,
      bgColor: "bg-primary hover:bg-blue-700",
      color: "text-white",
    };
  };

  return (
    <SignupLayout step={2}>
      <div className="w-full">
        <h1 className="text-xl font-semibold text-gray-900 mb-8">
          Create your profile
        </h1>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="mb-8">
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer size-[52px] border-2 border-dashed border-gray-200 bg-gray-100 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile picture"
                      width={52}
                      height={52}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl text-gray-300">A</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900 mb-1">
                  Upload profile picture
                </label>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            </div>
            {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="mt-2 w-[160px] h-[34px] text-center border border-gray-200 rounded-lg text-xs font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Remove profile picture
                </button>
              )}
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <Input
            label="First Name"
            placeholder="e.g. Bonnie"
            icon={<User className="size-4" />}
            error={errors.firstName?.message}
            {...register("firstName", validationRules.firstName)}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            placeholder="e.g. Green"
            icon={<User className="size-4" />}
            error={errors.lastName?.message}
            {...register("lastName", validationRules.lastName)}
          />

          {errors.general && (
            <p className="text-sm text-red-600 text-center">
              {errors.general.message}
            </p>
          )}

          <Button
            text={isLoading ? "Creating Profile..." : "Continue"}
            type="submit"
            disabled={getButtonState().disabled}
            bgColor={getButtonState().bgColor}
            height="h-[41px]"
            cn="!text-sm mt-8"
          />
        </form>
      </div>
    </SignupLayout>
  );
};

export default CreateProfile;
