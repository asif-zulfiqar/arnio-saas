"use client";
import AddContact from "@/components/conversations/AddContact";
import AllMessages from "@/components/conversations/AllMessages";
import ConversationBox from "@/components/conversations/ConversationBox";
import ConversationsFilter from "@/components/conversations/ConversationsFilter";
import ConversationsList from "@/components/conversations/ConversationsList";
import Search from "@/components/conversations/Search";
import SearchBar from "@/components/conversations/SearchBar";
import Modal from "@/components/global/Modal";
import Image from "next/image";
import { useState } from "react";

const Conversations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenSearch = () => setIsSearchOpen((prev) => !prev);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div className="flex gap-4 h-[calc(100vh-103px)]">
      <div className="max-w-xs w-full bg-white shadow-sm rounded-2xl relative overflow-y-scroll scroll-0 flex flex-col">
        <div className="sticky top-0 left-0 w-full bg-white pb-4">
          <div className="pt-5 pb-6 px-6 flex items-center justify-between">
            <h5 className="text-gray-900 text-xl font-semibold">
              Conversations
            </h5>
            <button className="cursor-pointer" onClick={handleOpenModal}>
              <Image
                src="/svgs/add-button.svg"
                width={28}
                height={28}
                alt="add button"
              />
            </button>
          </div>
          <div className="px-6 flex items-center justify-between gap-4">
            <AllMessages />
            <div className="flex items-center gap-4">
              <ConversationsFilter />
              <Search onClick={handleOpenSearch} />
            </div>
          </div>

          {isSearchOpen && <SearchBar />}
        </div>
        <ConversationsList />
      </div>

      {/* Conversations box */}
      <ConversationBox onStartConversation={handleOpenModal} />

      {isModalOpen && (
        <Modal title="Add Contact" onClose={handleCloseModal}>
          <AddContact onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Conversations;
