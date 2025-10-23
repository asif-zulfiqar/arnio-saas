import React, { useEffect } from "react";
import useFaqStore from "@/store/campaigns/faqStore";
import EmptyFaqState from "./EmptyFaqState";
import FaqCard from "./FaqCard";
import FaqDeleteModal from "./FaqDeleteModal";
import FaqAddModal from "./FaqAddModal";
import FaqEditModal from "./FaqEditModal";
import { Plus, Search, Loader } from "lucide-react";

const FaqList = () => {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredFaqs,
    showAddFaqModal,
    showEditFaqModal,
    showDeleteFaqModal,
    toggleAddFaqModal,
    toggleEditFaqModal,
    toggleDeleteFaqModal,
    selectedFaq,
    addFaq,
    updateFaq,
    deleteFaq,
    loading,
    loadFaqs,
  } = useFaqStore();

  const filteredFaqs = getFilteredFaqs();
  const hasNoFaqs = filteredFaqs.length === 0 && !searchQuery && !loading;

  const handleAddFaq = async (newFaq) => {
    const result = await addFaq(newFaq);
    if (result.success) {
      // Modal will close automatically via the store
    }
  };

  const handleUpdateFaq = async (updatedFaq) => {
    if (selectedFaq) {
      const result = await updateFaq(selectedFaq.id, updatedFaq);
      if (result.success) {
        // Modal will close automatically via the store
      }
    }
  };

  const handleDeleteFromEdit = () => {
    toggleDeleteFaqModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedFaq) {
      const result = await deleteFaq(selectedFaq.id);
      if (result.success) {
        toggleDeleteFaqModal();
      }
    }
  };

  // Show loading state
  if (loading && !showAddFaqModal && !showEditFaqModal) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
          <div className="flex items-center gap-4">
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-50 text-gray-500 border-gray-200" />
              <input
                type="text"
                placeholder="Search"
                disabled
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-4 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10 mt-1">
        <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAddFaqModal}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-50 text-gray-500 border-gray-200" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* FAQ List or Empty State */}
      {hasNoFaqs ? (
        <EmptyFaqState />
      ) : (
        <div>
          {filteredFaqs.length === 0 && searchQuery ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No FAQs match your search.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => <FaqCard key={faq.id} faq={faq} />)
          )}
        </div>
      )}

      {/* Modals */}
      <FaqAddModal
        isOpen={showAddFaqModal}
        onClose={toggleAddFaqModal}
        onAdd={handleAddFaq}
        loading={loading}
      />

      <FaqEditModal
        isOpen={showEditFaqModal}
        onClose={toggleEditFaqModal}
        onSave={handleUpdateFaq}
        onDelete={handleDeleteFromEdit}
        faq={selectedFaq}
        loading={loading}
      />

      <FaqDeleteModal
        isOpen={showDeleteFaqModal}
        onClose={toggleDeleteFaqModal}
        onConfirm={handleConfirmDelete}
        faqQuestion={selectedFaq?.question}
        loading={loading}
      />
    </div>
  );
};

export default FaqList;
