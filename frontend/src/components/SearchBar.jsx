import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(q), 450);
    return () => clearTimeout(t);
  }, [onSearch, q]);

  return (
    <div className="mb-4 relative">
      {/* Search Icon */}
      <AiOutlineSearch
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="
          w-full 
          border border-gray-300 
          rounded-lg
          pl-10 pr-4
          py-1      /* smaller height */
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
        "
      />
    </div>
  );
}
