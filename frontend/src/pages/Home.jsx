{
  /** 
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { API } from "../api";
import DealsSection from "../components/DealsSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/ads`)
      .then((r) => r.json()) // ✅ fixed fetch
      .then(setAds)
      .catch((err) => console.error("Failed to fetch ads:", err));
  }, []);

  const settings = {
    autoplay: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
  };

  return (
    <div className="p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      {/* Welcome Header /}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-300">
          Welcome to Spacexp Shopping Centre
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Shop the best products at the best prices
        </p>
        <Link to="/products">
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Browse Products
          </button>
        </Link>
      </div>

      {/* Ads Slider /}
      {ads.length > 0 && (
        <div className="mb-12">
          <Slider {...settings}>
            {ads.map((ad) => (
              <div key={ad._id}>
                {/** 
                <h6 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-900 dark:text-gray-300">
                  {ad.title}
                </h6>
                /}

                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-56 md:h-72 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Deals Section /}
      <div className="mb-12">
        <DealsSection />
      </div>

      {/* Featured Image Cards /}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Latest Fashion",
            desc: "Trendy clothing for men & women",
            img: "fashion.jpg",
          },
          {
            title: "Smart Electronics",
            desc: "Best deals on mobile, laptop & more",
            img: "electronics.jpg",
          },
          {
            title: "Fresh Groceries",
            desc: "Daily essentials delivered to you",
            img: "groceries.jpg",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded overflow-hidden shadow-lg hover:scale-105 transition bg-white dark:bg-gray-800"
          >
            <img
              src={`/images/${card.img}`}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
}

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { API } from "../api";
import DealsSection from "../components/DealsSection";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    fetch(`${API}/api/ads`)
      .then((r) => r.json())
      .then(setAds);
  }, []);
  
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
