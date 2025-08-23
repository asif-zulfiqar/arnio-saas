import { Search as SearchIcon } from "lucide-react";

const Search = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-gray-50 transition-colors"
    >
      <SearchIcon className="size-4 text-gray-700" />
    </button>
  );
};

export default Search;
