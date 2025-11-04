{
  /** 
import React, { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof onSearch === "function") onSearch(q.trim() || undefined);
    }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="mb-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100 
                   placeholder-gray-500 dark:placeholder-gray-400 
                   p-3 rounded focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  );
}
  */
}

import React, { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(q), 450);
    return () => clearTimeout(t);
  }, [onSearch, q]);

  return (
    <div className="mb-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="w-full border p-3 rounded"
      />
    </div>
  );
}
