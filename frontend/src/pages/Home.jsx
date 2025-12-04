import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DealsSection from "../components/DealsSection";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/ads`)
      .then((r) => r.json())
      .then(setAds);
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query) { setProducts([]); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products?search=${query}`);
      if (!res.ok) throw new Error("Failed to search products");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to load search results.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const settings = { autoplay: true, dots: true, infinite: true, slidesToShow: 1, slidesToScroll: 1, autoplaySpeed: 4000, };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {loading && ( <div className="text-center my-4 text-gray-600">Searching...</div> )}

      {/* Search Results */}
      <div className="mt-10">
        {loading ? (
          <div className="text-gray-700 dark:text-gray-200">Loading...</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-3">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {ads.length > 0 && (
        <div className="mb-6">
          <Slider {...settings}>
            {ads.map((ad) => (
              <div key={ad._id}>
                <img src={ad.image} alt={ad.title} className="w-full h-56 object-cover rounded" />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <DealsSection />
    </div>
  );
}
