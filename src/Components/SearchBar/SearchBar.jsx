
import { useState } from "react";
import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search.trim());
  };

  return (
    <div className="search-section">
      <form className="search-container" onSubmit={handleSubmit}>

        <Search size={22} className="search-icon" />

        <input
          type="search"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />

        <button type="submit">
          Search
        </button>

      </form>
    </div>
  );
}

export default SearchBar;
