import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import { SearchIcon, X } from "lucide-react";
import { useEffect, useRef } from "react";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useWorkspaceStore();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-300 h-[37px] px-4 py-2 mx-6 mt-2 focus-within:border-primary/80">
      <SearchIcon className="size-4 text-gray-500 mr-[10px] flex-shrink-0" />
      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search messages or contact"
        className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 border-none outline-none text-sm"
        autoFocus
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="flex-shrink-0 ml-3 p-1"
        >
          <X className="size-3 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
