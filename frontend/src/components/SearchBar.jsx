import React, { useEffect, useState } from "react";
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(q), 450);
    return () => clearTimeout(t);
  }, [onSearch, q]);

  return (
    <div className="mb-4">
      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onSearch && onSearch(e.target.value);
        }}
        placeholder="Search products..."
        className="w-full border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
