"use client";
import AddContact from "@/components/conversations/AddContact";
import AllMessages from "@/components/conversations/AllMessages";
import ConversationBox from "@/components/conversations/ConversationBox";
import ConversationsFilter from "@/components/conversations/ConversationsFilter";
import ConversationsList from "@/components/conversations/ConversationsList";
import Search from "@/components/conversations/Search";
import SearchBar from "@/components/conversations/SearchBar";
import Modal from "@/components/global/Modal";
import Profile from "@/components/profile/Profile";
import Welcome from "@/components/welcome/Welcome";
import { useDebounce } from "@/hooks/useDebounce";
import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const Conversations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  const { searchTerm, setSearchTerm } = useWorkspaceStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleOpenSearch = () => setIsSearchOpen((prev) => !prev);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setIsLoading(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (debouncedSearchTerm && isSearchOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, isSearchOpen]);
  return (
    <div className="flex gap-4 h-[calc(100vh-103px)]">
      <div className="max-w-xs w-full bg-white shadow-sm rounded-2xl relative overflow-y-scroll scroll-0 flex flex-col">
        <div className="sticky top-0 left-0 z-50 w-full bg-white pb-4">
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
              {/* <ConversationsFilter /> */}
              <Search onClick={handleOpenSearch} />
            </div>
          </div>

          {isSearchOpen && <SearchBar />}
        </div>
        <ConversationsList isLoading={isLoading} />
      </div>

      {/* Conversations box */}
      <ConversationBox
        onStartConversation={handleOpenModal}
        setIsProfileOpen={setIsProfileOpen}
      />

      {/* Profile Box */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden py-4 px-5"
          >
            <Profile setIsProfileOpen={setIsProfileOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <Modal title="Add Contact" onClose={handleCloseModal}>
          <AddContact onClose={handleCloseModal} />
        </Modal>
      )}

      {isWelcomeScreen && <Welcome onClose={setIsWelcomeScreen} />}
    </div>
  );
};

export default Conversations;
