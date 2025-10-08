"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useOnboardingStore from "@/store/onboarding/onboardingStore";
import { ArrowDown } from "@/app/assets/svgs/icons";

const OnboardingModal = () => {
  const {
    isOnboardingActive,
    currentStep,
    totalSteps,
    getCurrentStep,
    nextStep,
    previousStep,
    skipOnboarding,
    closeOnboarding,
  } = useOnboardingStore();

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);
  const targetElementRef = useRef(null);

  const currentStepData = getCurrentStep();

  useEffect(() => {
    if (isOnboardingActive && currentStepData?.targetElement) {
      const targetElement = document.querySelector(
        `[data-onboarding-target="${currentStepData.targetElement}"]`
      );
      if (targetElement) {
        targetElementRef.current = targetElement;
        positionModal(targetElement);
      }
    } else if (isOnboardingActive && !currentStepData?.targetElement) {
      // Center the modal for steps without target elements
      setModalPosition({
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
    }
  }, [isOnboardingActive, currentStep, currentStepData]);

  const positionModal = (targetElement) => {
    if (!targetElement || !modalRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const modalRect = modalRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left, transform;

    // Position modal based on target element
    if (currentStepData.position === "left") {
      // Position to the right of the target element
      left = targetRect.right + 20;
      top = targetRect.top + targetRect.height / 2 - modalRect.height / 2;

      // Ensure modal stays within viewport
      if (left + modalRect.width > viewportWidth - 20) {
        left = targetRect.left - modalRect.width - 20;
      }
      if (top < 20) top = 20;
      if (top + modalRect.height > viewportHeight - 20) {
        top = viewportHeight - modalRect.height - 20;
      }

      transform = "none";
    } else {
      // Center the modal
      top = "50%";
      left = "50%";
      transform = "translate(-50%, -50%)";
    }

    setModalPosition({ top, left, transform });

    // Position arrow
    if (currentStepData.showArrow && currentStepData.position === "left") {
      const arrowTop = targetRect.top + targetRect.height / 2 - 8;
      const arrowLeft =
        left > targetRect.right
          ? targetRect.right + 10
          : left + modalRect.width - 10;
      setArrowPosition({ top: arrowTop, left: arrowLeft });
    }
  };

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const handleClose = () => {
    closeOnboarding();
  };

  if (!isOnboardingActive || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gray-800/65 bg-opacity-50"
      >
        {/* Arrow pointing to target element */}
        {currentStepData.showArrow && currentStepData.targetElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute size-4 ml-[2px] z-40 rotate-270"
            style={{
              top: arrowPosition.top,
              left: arrowPosition.left,
            }}
          >
            <ArrowDown color="#fff" />
          </motion.div>
        )}

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute rounded-2xl shadow-xl border border-gray-[#E5E7EB] w-80 max-w-sm px-3"
          style={{
            top: modalPosition.top,
            left: modalPosition.left,
            transform: modalPosition.transform,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              {currentStep} of {totalSteps}
            </span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
              {currentStepData.isPro && (
                <span className="px-[6px] py-[2px] text-xs font-medium text-[#42389D] bg-[#E5EDFF] rounded-sm">
                  PRO
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors !cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors !cursor-pointer"
              >
                {currentStep === totalSteps ? "Finish" : "Next"}
                {currentStep < totalSteps && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
