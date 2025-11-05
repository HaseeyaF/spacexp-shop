import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DealsSection from "../components/DealsSection";
import SearchBar from "../components/SearchBar";
import { API } from "../api";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch(`${API}/api/ads`)
      .then((r) => r.json())
      .then(setAds);
  }, []);

  const handleSearch = query => {
    if (!query) return setProducts([]);
    fetch(`${API}/api/products?search=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(res => setProducts(res.data || []))
      .catch(console.error);
  };
  
  const settings = {
    autoplay: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
  };
  
  return (
    <div className="container mx-auto p-4">

      <SearchBar onSearch={handleSearch} />

      {/* 🧾 Search Results (Optional) */}
      {products.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => (
              <div
                key={p._id}
                className="border rounded-lg p-3 hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-gray-500 mb-1">{p.brand}</div>
                <div className="font-bold text-green-700">
                  Rs. {p.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ads.length > 0 && (
        <div className="mb-6">
          <Slider {...settings}>
            {ads.map((ad) => (
              <div key={ad._id}>
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-56 object-cover rounded"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      <DealsSection /> 
    </div>
  );
}
