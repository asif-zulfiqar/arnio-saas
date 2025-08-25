"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ title, onClose, children, width }) => {
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
        className={`bg-white rounded-lg border border-gray-200 p-4 md:py-6 md:px-8 overflow-y-auto h-fit max-h-full ${
          width ? width : "w-[300px] sm:w-[460px]"
        }`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-medium text-sm sm:text-base md:text-xl">
            {title}
          </h2>
          <div className="cursor-pointer" onClick={onClose}>
            <X className="text-gray-400 size-4" />
          </div>
        </div>
        <div className="mt-4 md:mt-5">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
