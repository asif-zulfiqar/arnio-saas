// FaqEditModal.jsx
"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/global/Modal";

const FaqEditModal = ({ isOpen, onClose, onSave, onDelete, faq, loading }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    }
  }, [faq]);

  const handleSave = () => {
    if (question.trim() && answer.trim()) {
      onSave({ question: question.trim(), answer: answer.trim() });
      onClose();
    }
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Question" onClose={onClose} width="w-[450px]">
      <div className="space-y-6">
        {/* Question Field */}
        <div>
          <label className="block text-gray-900 font-medium text-[14px] leading-[150%] mb-2">
            Question
          </label>
          <input
            type="text"
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
          {/* Cancel button on the left */}
          <button
            onClick={onClose}
            className="w-[64px] h-[34px] px-3 py-2 border border-gray-300 text-gray-700 font-medium text-[12px] leading-[150%] rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          {/* Delete and Save Changes on the right */}
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="h-[34px] px-3 py-2 border border-red-700 text-red-700 font-medium text-[12px] leading-[150%] rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={!question.trim() || !answer.trim() || loading}
              className="h-[34px] px-3 py-2 bg-blue-600 text-white font-medium text-[12px] leading-[150%] rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FaqEditModal;
