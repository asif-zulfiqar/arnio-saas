"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import SignupLayout from "@/components/auth/SignupLayout";
import Image from "next/image";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Upload, Building2, Globe, MapPin } from "lucide-react";
import useSignupStore from "@/store/auth/signupStore";
import { useRouter } from "next/navigation";

const Workspace = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const { 
    setCompanyLogo, 
    setCompanyName, 
    setWorkspaceHandle, 
    setBillingCountry,
    setCurrentStep,
    prevStep,
    companyName,
    workspaceHandle,
    billingCountry
  } = useSignupStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      companyName: companyName || "",
      workspaceHandle: workspaceHandle || "dashboard.arnio.co/my-workspace",
      billingCountry: billingCountry || "United States of America",
    },
  });

  const watchCompanyName = watch("companyName");
  const watchWorkspaceHandle = watch("workspaceHandle");

  // Validation rules
  const validationRules = {
    companyName: {
      required: "Company name is required",
    },
    workspaceHandle: {
      required: "Workspace handle is required",
    },
    billingCountry: {
      required: "Billing country is required",
    },
  };

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError("companyLogo", {
          type: "manual",
          message: "File size must be under 10MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("companyLogo", {
          type: "manual",
          message: "Please upload a valid image file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setCompanyLogo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store data in Zustand store
      setCompanyName(data.companyName);
      setWorkspaceHandle(data.workspaceHandle);
      setBillingCountry(data.billingCountry);
      
      // Navigate to team members step
      setCurrentStep(3);
      router.push("/team-members");
    } catch (error) {
      console.error("Form submission failed:", error);
      setError("general", {
        type: "manual",
        message: "Something went wrong. Please try again.",
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
        bgColor: "bg-gray-200",
        color: "text-gray-400",
      };
    }

    if (errors.companyName || errors.workspaceHandle || !watchCompanyName?.trim() || !watchWorkspaceHandle?.trim()) {
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

  // Handle back button
  const handleBack = () => {
    prevStep();
    router.push("/signup");
  };

  return (
    <SignupLayout step={2}>
      <div className="w-full">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center">
          Create your workspace
        </h1>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-8">
          {/* Company Logo */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Company logo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Company logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Building2 className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">A</span>
                  </div>
                )}
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              We support PNGs, JPEGs under 10MB. Recommended size is 400x400px
            </p>
            {errors.companyLogo && (
              <p className="mt-1 text-sm text-red-600">{errors.companyLogo.message}</p>
            )}
          </div>

          {/* Company Name */}
          <Input
            label="Company Name"
            placeholder="Enter your company name..."
            error={errors.companyName?.message}
            {...register("companyName", validationRules.companyName)}
          />

          {/* Workspace Handle */}
          <Input
            label="Workspace handle"
            placeholder="dashboard.arnio.co/my-workspace"
            error={errors.workspaceHandle?.message}
            {...register("workspaceHandle", validationRules.workspaceHandle)}
          />

          {/* Billing Country */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Billing country
            </label>
            <div className="relative">
              <select
                {...register("billingCountry", validationRules.billingCountry)}
                className="w-full h-[42px] px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none"
              >
                <option value="United States of America">United States of America</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Other">Other</option>
              </select>
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {errors.billingCountry && (
              <p className="mt-1 text-sm text-red-600">{errors.billingCountry.message}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">{errors.general.message}</p>
          )}

          <Button
            text={isLoading ? "Creating..." : "Continue"}
            type="submit"
            disabled={getButtonState().disabled}
            bgColor={getButtonState().bgColor}
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
        </div>
    </SignupLayout>
  );
};

export default Workspace;
