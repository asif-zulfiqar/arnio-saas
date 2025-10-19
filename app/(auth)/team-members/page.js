"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SignupLayout from "@/components/auth/SignupLayout";
import Button from "@/components/global/small/Button";
import Input from "@/components/global/small/Input";
import { Plus, Trash2, Copy, Mail, User, Shield } from "lucide-react";
import useSignupStore from "@/store/auth/signupStore";
import useAuthStore from "@/store/auth/authStore";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/global/small/Dropdown";

const TeamMembers = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const {
    teamMembers,
    addTeamMember,
    removeTeamMember,
    setCurrentStep,
    prevStep,
    workspaceId,
    setWorkspaceId,
  } = useSignupStore();
  const { inviteTeamMembers, getUserWorkspaces, user } = useAuthStore();

  // React Hook Form setup for adding new member
  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    formState: { errors: memberErrors },
    watch: watchMember,
    reset: resetMember,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      fullName: "",
      role: "AGENT",
    },
  });

  const watchEmail = watchMember("email");
  const watchFullName = watchMember("fullName");

  // Fetch workspace ID if not available (for users redirected from AuthGuard)
  useEffect(() => {
    const fetchWorkspaceId = async () => {
      if (!workspaceId && user?.id) {
        try {
          const response = await getUserWorkspaces(user.id);
          console.log("Workspaces response:", response);
          
          // Handle different response structures
          const workspaces = response?.data?.workspaces || response?.workspaces || response;
          
          if (workspaces && workspaces.length > 0) {
            const workspace = workspaces[0];
            setWorkspaceId(workspace.id);
            console.log("Fetched workspace ID for team members:", workspace.id);
          } else {
            console.error("No workspaces found in response:", response);
          }
        } catch (error) {
          console.error("Failed to fetch workspace ID:", error);
        }
      }
    };

    fetchWorkspaceId();
  }, [workspaceId, user?.id, getUserWorkspaces, setWorkspaceId]);

  // Validation rules for team member
  const memberValidationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
    fullName: {
      required: "Full name is required",
    },
  };

  // Handle adding new team member
  const handleAddMember = (data) => {
    // Check if email already exists
    const emailExists = teamMembers.some(
      (member) => member.email === data.email
    );
    if (emailExists) {
      memberErrors.email = { message: "This email is already added" };
      return;
    }

    // Check if we've reached the limit of 5 members
    if (teamMembers.length >= 5) {
      alert("You can only add up to 5 team members");
      return;
    }

    addTeamMember({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    });

    resetMember();
    setShowAddForm(false);
  };

  // Handle removing team member
  const handleRemoveMember = (id) => {
    removeTeamMember(id);
  };

  // Handle form submission (continue to next step)
  const handleContinue = async () => {
    setIsLoading(true);
    setInviteError(""); // Clear any previous errors

    try {
      // If there are team members, invite them
      if (teamMembers.length > 0) {
        let inviteSuccess = false;
        
        if (!workspaceId) {
          console.error("No workspace ID available");
          // Try to fetch workspace ID one more time
          try {
            const response = await getUserWorkspaces(user.id);
            console.log("Retry workspaces response:", response);
            
            // Handle different response structures
            const workspaces = response?.data?.workspaces || response?.workspaces || response;
            
            if (workspaces && workspaces.length > 0) {
              const workspace = workspaces[0];
              setWorkspaceId(workspace.id);
              // Retry the invitation with the fetched workspace ID
              const inviteData = {
                workspaceId: workspace.id,
                teamMembers: teamMembers.map(member => ({
                  email: member.email,
                  fullName: member.fullName,
                  role: member.role.toUpperCase(),
                })),
              };
              const result = await inviteTeamMembers(inviteData);
              inviteSuccess = result.success;
              if (!result.success) {
                setInviteError(result.error || "Failed to invite team members. Please try again.");
                console.error("Failed to invite team members:", result.error);
              }
            } else {
              setInviteError("No workspace found. Please try again.");
              console.error("No workspaces found for user in retry:", response);
              return;
            }
          } catch (error) {
            setInviteError("Failed to fetch workspace. Please try again.");
            console.error("Failed to fetch workspace:", error);
            return;
          }
        } else {
          const inviteData = {
            workspaceId,
            teamMembers: teamMembers.map(member => ({
              email: member.email,
              fullName: member.fullName,
              role: member.role.toUpperCase(),
            })),
          };

          const result = await inviteTeamMembers(inviteData);
          inviteSuccess = result.success;
          
          if (!result.success) {
            setInviteError(result.error || "Failed to invite team members. Please try again.");
            console.error("Failed to invite team members:", result.error);
            return; // Don't proceed to next step if invitation fails
          }
        }

        // Only proceed if invitation was successful
        if (!inviteSuccess) {
          return; // Stay on current step if invitation failed
        }
      }

      // Navigate to preferences step only if no team members or invitation succeeded
      setCurrentStep(5);
      router.push("/preferences");
    } catch (error) {
      setInviteError("Something went wrong. Please try again.");
      console.error("Navigation failed:", error);
      // Don't proceed to next step on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip
  const handleSkip = () => {
    setCurrentStep(5);
    router.push("/preferences");
  };

  // Handle back button
  const handleBack = () => {
    prevStep();
    router.push("/workspace");
  };

  // Get button state for add member
  const getAddMemberButtonState = () => {
    if (
      !watchEmail?.trim() ||
      !watchFullName?.trim()
    ) {
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
    <SignupLayout step={4}>
      <div className="w-full">
        <h1 className="text-xl font-semibold text-gray-900">
          Add Team Members
        </h1>

        <p className="text-sm text-gray-500 mt-1 max-w-[380px]">
          You can invite up to 5 team members. You can also add them later in
          Settings
        </p>

        <div className="mt-8 space-y-4">
          {/* Existing team members */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {member.role}
                </span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}

          {/* Add new member form */}
          {showAddForm && (
            <div className="p-4 border border-gray-100 rounded-2xl">
              <form
                onSubmit={handleSubmitMember(handleAddMember)}
                className="space-y-3"
              >
                <Input
                  placeholder="user@email.com"
                  label="Email"
                  error={memberErrors.email?.message}
                  {...registerMember("email", memberValidationRules.email)}
                  className="flex-1"
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    className="col-span-2"
                    placeholder="Enter full name..."
                    label="Full Name"
                    error={memberErrors.fullName?.message}
                    {...registerMember(
                      "fullName",
                      memberValidationRules.fullName
                    )}
                  />
                  <Dropdown
                    label="Role"
                    options={[
                      { option: "Agent", value: "AGENT" },
                      { option: "Admin", value: "ADMIN" },
                    ]}
                  />
                </div>

                {/* <div className="flex items-center space-x-2">
                  <select
                    {...registerMember("role")}
                    className="flex-1 h-[42px] px-4 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="AGENT">AGENT</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div> */}

                <div className="flex space-x-2">
                  <Button
                    text="Add Member"
                    type="submit"
                    disabled={getAddMemberButtonState().disabled}
                    bgColor={getAddMemberButtonState().bgColor}
                    height="h-[36px]"
                    cn="!text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add member button */}
          {!showAddForm && teamMembers.length < 5 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>

          <div className="mt-8 space-y-4">
            {/* Error message display */}
            {inviteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{inviteError}</p>
              </div>
            )}
            
            <Button
              text={isLoading ? "Continuing..." : "Continue"}
            onClick={handleContinue}
            disabled={isLoading}
            bgColor="bg-primary hover:bg-blue-700"
            height="h-[41px]"
            cn="!text-sm"
          />
          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-600 hover:text-gray-900 text-center"
          >
            Skip for now
          </button>
        </div>
      </div>
    </SignupLayout>
  );
};

export default TeamMembers;
