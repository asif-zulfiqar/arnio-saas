// FaqAddModal.jsx
"use client";
import React, { useState } from "react";
import Modal from "@/components/global/Modal";

const FaqAddModal = ({ isOpen, onClose, onAdd, loading }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (question.trim() && answer.trim()) {
      onAdd({ question: question.trim(), answer: answer.trim() });
      setQuestion("");
      setAnswer("");
      onClose();
    }
  };

  const handleClose = () => {
    setQuestion("");
    setAnswer("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add Question"
      onClose={handleClose}
      width="w-[450px] "
      height="h-[528px]"
    >
      <div className="space-y-6">
        {/* Question Field */}
        <div>
          <label className="block text-gray-900 font-medium text-[14px] leading-[150%] mb-2">
            Question
          </label>
          <input
            type="text"
            placeholder="e.g. How long does shipping take?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-[42px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[14px] leading-[125%] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-gray-500 text-[12px] leading-[150%] mt-1">
            Write the question as a customer would ask.
          </p>
        </div>

        {/* Answer Field */}
        <div>
          <label className="block text-gray-900 font-medium text-[14px] leading-[150%] mb-2">
            Answer
          </label>
          <textarea
            placeholder="e.g. Standard shipping takes 3–5 business days"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[14px] leading-[125%] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-gray-500 text-[12px] leading-[150%] mt-1">
            Keep the answer brief; add links if needed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleClose}
            className="w-[64px] h-[34px] px-3 py-2 border border-gray-200 text-gray-700 font-medium text-[12px] leading-[150%] rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!question.trim() || !answer.trim() || loading}
            className="w-[103px] h-[34px] px-3 py-2 bg-blue-600 text-white font-medium text-[12px] leading-[150%] rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FaqAddModal;
