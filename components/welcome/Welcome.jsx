import { useState } from "react";
import { motion } from "framer-motion";
import ActivatePhoneLine from "./ActivatePhoneLine";
import StartTrial from "./StartTrial";

const Welcome = ({ onClose }) => {
  const [step, setStep] = useState(1);
  return (
    <motion.div
      className="modal bg-[#1E293B]/80 fixed top-0 left-0 inset-0 z-50 p-6 flex items-center justify-center"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={`bg-white rounded-lg border border-gray-200 p-4 md:py-8 md:px-5 overflow-y-auto h-fit max-h-full max-w-[500px]"
        }`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {step === 1 && <StartTrial setStep={setStep} />}
        {step === 2 && <ActivatePhoneLine onClose={onClose} />}
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
