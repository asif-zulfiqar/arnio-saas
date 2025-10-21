"use client";

import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import Dropdown from "@/components/global/small/Dropdown";
import Input from "@/components/global/small/Input";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const COUNTRY_OPTIONS = [
  { option: "United States of America", value: "United States of America" },
  { option: "Canada", value: "Canada" },
  { option: "United Kingdom", value: "United Kingdom" },
  { option: "Australia", value: "Australia" },
  { option: "Other", value: "Other" },
];

const Workspace = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [billingCountryError, setBillingCountryError] = useState("");
  const [existingWorkspace, setExistingWorkspace] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    setCompanyLogo,
    setCompanyName,
    setWorkspaceHandle,
    setBillingCountry,
    setWorkspaceId,
    setExistingWorkspaceData,
    setCurrentStep,
    prevStep,
    companyName,
    workspaceHandle,
    billingCountry,
  } = useSignupStore();
  const { createWorkspace, updateWorkspace, getUserWorkspaces, user } = useAuthStore();

  const handleCountrySelect = (value) => {
    setBillingCountry(value);
    setBillingCountryError("");
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      companyName: companyName || "",
      workspaceHandle: workspaceHandle,
      billingCountry: billingCountry,
    },
  });

  const watchCompanyName = watch("companyName");
  const watchWorkspaceHandle = watch("workspaceHandle");
  
  // Track previous values to detect actual user input changes
  const prevCompanyNameRef = useRef(watchCompanyName);
  const prevWorkspaceHandleRef = useRef(watchWorkspaceHandle);

  // Clear general errors only when user actually changes input values
  useEffect(() => {
    if (errors.general && (watchCompanyName !== prevCompanyNameRef.current || watchWorkspaceHandle !== prevWorkspaceHandleRef.current)) {
      clearErrors("general");
    }
    prevCompanyNameRef.current = watchCompanyName;
    prevWorkspaceHandleRef.current = watchWorkspaceHandle;
  }, [watchCompanyName, watchWorkspaceHandle, errors.general, clearErrors]);

  // Check for existing workspaces on component mount
  useEffect(() => {
    const checkExistingWorkspace = async () => {
      if (!user?.id) return;

      try {
        const response = await getUserWorkspaces(user.id);
        console.log("User workspaces response:", response);
        
        // Handle different response structures
        const workspaces = response?.data?.workspaces || response?.workspaces || response;
        
        if (workspaces && workspaces.length > 0) {
          const workspace = workspaces[0]; // Get first workspace
          setExistingWorkspace(workspace);
          setIsEditMode(true);
          
          // Update signup store with existing workspace data
          setExistingWorkspaceData(workspace);
          
          // Pre-fill form with existing data
          setValue("companyName", workspace.companyName || "");
          // Add prefix to existing handle
          const existingHandle = workspace.handle || "";
          const fullHandle = existingHandle.startsWith("dashboard.arnio.co/") 
            ? existingHandle 
            : `dashboard.arnio.co/${existingHandle}`;
          setValue("workspaceHandle", fullHandle);
          setBillingCountry(workspace.billingCountry || "United States of America");
          
          // Set logo preview if exists
          if (workspace.logoUrl) {
            setLogoPreview(workspace.logoUrl);
          }
          
          console.log("Found existing workspace:", workspace);
        }
      } catch (error) {
        console.error("Failed to fetch existing workspaces:", error);
        // Continue with create mode if fetch fails
      }
    };

    checkExistingWorkspace();
  }, [user?.id, getUserWorkspaces, setValue, setBillingCountry]);

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

      setLogoFile(file);
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
    if (!billingCountry) {
      setBillingCountryError("Billing country is required");
      return;
    }

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Debug: Check user object structure
      console.log("User object:", user);
      console.log("User ID:", user?.id);

      // Ensure we have a user ID
      if (!user?.id) {
        console.error("User ID is missing from user object");
        throw new Error("User ID is required to create workspace");
      }

      // Extract handle part from the full workspace handle
      const fullHandle = data.workspaceHandle;
      const handlePart = fullHandle.replace("dashboard.arnio.co/", "");

      // Prepare workspace data for API
      const workspaceData = {
        userId: user.id,
        companyName: data.companyName,
        workspaceHandle: handlePart, // Send only the handle part, not the full URL
        billingCountry: billingCountry, // Use from signup store, not form data
        companyLogo: logoFile, // File object for upload
      };

      console.log("Workspace data being sent:", workspaceData); // Debug log

      let result;
      
      if (isEditMode && existingWorkspace) {
        // Update existing workspace
        result = await updateWorkspace(existingWorkspace.id, workspaceData);
      } else {
        // Create new workspace
        result = await createWorkspace(workspaceData);
      }

      if (result.success) {
        // Store data in Zustand store
        setCompanyName(data.companyName);
        setWorkspaceHandle(fullHandle); // Store the full handle with prefix
        setBillingCountry(billingCountry);
        
        // Store workspace ID for team members step
        const workspaceId = result.workspace?.id || result.workspaceId || existingWorkspace?.id;
        setWorkspaceId(workspaceId);

        // Small delay to prevent blank screen flash
        setTimeout(() => {
          setCurrentStep(4);
          router.push("/team-members");
        }, 100);
      } else {
        // Clear any existing errors first
        clearErrors("general");
        setError("general", {
          type: "manual",
          message: result.error || result.message || `Failed to ${isEditMode ? 'update' : 'create'} workspace. Please try again.`,
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      // Clear any existing errors first
      clearErrors("general");
      setError("general", {
        type: "manual",
        message: error.message || error.response?.data?.message || "Something went wrong. Please try again.",
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
      !watchCompanyName?.trim() ||
      !watchWorkspaceHandle?.trim()
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
    <SignupLayout step={3}>
      <div className="w-full">
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditMode ? "Update your workspace" : "Create your workspace"}
        </h1>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 mt-8"
        >
          {/* Company Logo */}
          <div className="flex gap-3 mb-8">
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
                className="cursor-pointer size-[52px] border-2 border-dashed border-gray-200 bg-gray-100 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Company logo"
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
            <div>
              <label className="text-base font-medium text-gray-900 mb-1">
                Company logo
              </label>
              <p className="text-xs text-gray-500 max-w-[220px]">
                We support PNGs,JPEGs under 10MB Recommended size is 400x400px
              </p>
            </div>
            {errors.companyLogo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyLogo.message}
              </p>
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
          <Dropdown
            label="Billing country"
            options={COUNTRY_OPTIONS}
            defaultText="Select your billing country"
            onSelect={handleCountrySelect}
            initialValue={billingCountry}
            helperText={billingCountryError}
            status={billingCountryError ? "error" : ""}
          />

          {errors.general && (
            <p className="text-sm text-red-600 text-center">
              {errors.general.message}
            </p>
          )}

          <Button
            text={isLoading ? (isEditMode ? "Updating..." : "Creating...") : "Continue"}
            type="submit"
            disabled={getButtonState().disabled}
            bgColor={getButtonState().bgColor}
            height="h-[41px]"
            cn="!text-sm mt-14"
          />
        </form>
      </div>
    </SignupLayout>
  );
};

export default Workspace;
