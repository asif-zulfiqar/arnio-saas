"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

const OnboardingTrigger = ({
  children,
  className = "",
  variant = "button",
  size = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { startOnboarding, resetOnboarding } = useOnboardingStore();

  const handleStartOnboarding = () => {
    resetOnboarding();
    startOnboarding();
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    default: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleStartOnboarding}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HelpCircle className={`${iconSizes[size]} text-gray-500`} />
        {isHovered && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            Start Tour
          </motion.div>
        )}
      </motion.button>
    );
  }

  if (variant === "link") {
    return (
      <button
        onClick={handleStartOnboarding}
        className={`text-primary hover:text-primary/80 underline transition-colors duration-200 ${className}`}
      >
        {children || "Start onboarding"}
      </button>
    );
  }

  // Default button variant
  return (
    <motion.button
      onClick={handleStartOnboarding}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center gap-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <HelpCircle className={iconSizes[size]} />
      {children || "Start Tour"}
    </motion.button>
  );
};

export default OnboardingTrigger;
