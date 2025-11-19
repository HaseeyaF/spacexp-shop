import React, { useEffect, useState, useCallback } from "react";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { API } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  const handleFilterChange = useCallback((f) => {
    setFilters(f);
    setPage(1);
  }, []);

  // Remove undefined or empty filter values
  const cleanFilters = useCallback(
    (obj) =>
      Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(obj).filter(([_, v]) => v !== undefined && v !== "")
      ),
    []
  );

  const fetchProducts = useCallback(async () => {
    if (products.length === 0) setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams(
        cleanFilters({ ...filters, page, limit: 24, sort })
      );
      const res = await fetch(`${API}/api/products?${qs.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setProducts(data.data || []);
      setMeta(data.meta || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Unable to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [products.length, cleanFilters, filters, page, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4">
        {/* Search Bar */}
        <SearchBar
          onSearch={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        />

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-72 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Filters onChange={handleFilterChange} />
          </aside>

          {/* Main Products Area */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {products.length} results
              </div>
              <div>
                <select
                  className="border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="newest">Newest</option>
                  <option value="best_selling">Best selling</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-gray-700 dark:text-gray-200">Loading...</div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No products found for selected filters.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-4">
              <button
                disabled={meta.page <= 1}
                onClick={() => setPage(meta.page - 1)}
                className="px-4 py-2 disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="px-2 py-2 text-sm">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage(meta.page + 1)}
                className="px-4 py-2 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
