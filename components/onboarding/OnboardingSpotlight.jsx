"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

const OnboardingSpotlight = () => {
  const {
    isOnboardingActive,
    currentStep,
    steps,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    getCurrentStep,
  } = useOnboardingStore();

  const [targetElement, setTargetElement] = useState(null);
  const [spotlightPosition, setSpotlightPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const currentStepData = getCurrentStep();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Find and position the target element
  useEffect(() => {
    if (!isOnboardingActive || !currentStepData) return;

    const findTargetElement = () => {
      // Try to find element by data attribute first
      let element = document.querySelector(
        `[data-onboarding-target="${currentStepData.id}"]`
      );

      // Fallback to common selectors based on step
      if (!element) {
        const selectors = {
          campaign: '[href="/campaigns"]',
          settings: '[href="/settings"]',
          analytics: '[href="/analytics"]',
          help: '[href="#"]',
          "team-members": '[href="/settings"]', // Team members is usually in settings
        };

        element = document.querySelector(selectors[currentStepData.id]);
      }

      return element;
    };

    const element = findTargetElement();
    setTargetElement(element);

    if (element) {
      const rect = element.getBoundingClientRect();
      setSpotlightPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      // Position modal relative to target element
      const modalWidth = 400;
      const modalHeight = 300;
      const padding = 20;

      let modalX = rect.left + rect.width / 2 - modalWidth / 2;
      let modalY = rect.bottom + padding;

      // Adjust if modal goes off screen
      if (modalX < padding) modalX = padding;
      if (modalX + modalWidth > window.innerWidth - padding) {
        modalX = window.innerWidth - modalWidth - padding;
      }
      if (modalY + modalHeight > window.innerHeight - padding) {
        modalY = rect.top - modalHeight - padding;
      }

      setModalPosition({ x: modalX, y: modalY });
    } else {
      // Center modal if no target element found
      setModalPosition({
        x: window.innerWidth / 2 - 200,
        y: window.innerHeight / 2 - 150,
      });
    }
  }, [isOnboardingActive, currentStep, currentStepData]);

  if (!isOnboardingActive || !currentStepData) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      previousStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const handleClose = () => {
    skipOnboarding();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spotlight overlay */}
        <div className="absolute inset-0 bg-black/50">
          {targetElement && (
            <motion.div
              className="absolute bg-white rounded-lg shadow-lg"
              style={{
                left: spotlightPosition.x - 8,
                top: spotlightPosition.y - 8,
                width: spotlightPosition.width + 16,
                height: spotlightPosition.height + 16,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Modal */}
        <motion.div
          ref={modalRef}
          className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 w-[400px] max-w-[90vw]"
          style={{
            left: modalPosition.x,
            top: modalPosition.y,
          }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              {currentStepData.showProBadge && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                  PRO
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {currentStepData.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Skip for now
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isFirstStep
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {isLastStep ? "Finish" : "Next"}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingSpotlight;
