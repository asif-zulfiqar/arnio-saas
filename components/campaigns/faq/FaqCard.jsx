import React from "react";
import { Edit, Trash2 } from "lucide-react";
import useFaqStore from "@/store/campaigns/faqStore";

const FaqCard = ({ faq }) => {
  const { setSelectedFaq, toggleEditFaqModal, toggleDeleteFaqModal } =
    useFaqStore();

  const handleEdit = () => {
    setSelectedFaq(faq);
    toggleEditFaqModal();
  };

  const handleDelete = () => {
    setSelectedFaq(faq);
    toggleDeleteFaqModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold  text-gray-900 mb-2">
            {faq.question}
          </h3>
          <p className="text-lg text-gray-500">{faq.answer}</p>
        </div>
        <div className="flex items-center gap-6 ml-4">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqCard;
