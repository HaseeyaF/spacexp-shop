import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "./QuickViewModal";
import { FaStar } from "react-icons/fa";
import { API } from "../api";

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);

  const variant = product.variants?.[0] || {};
  const price = variant.price ?? product.price ?? 0;
  const originalPrice = variant.originalPrice ?? product.originalPrice ?? null;
  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const navigate = useNavigate();

  // Fetch reviews only for rating display
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API}/api/reviews?productId=${product._id}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const avg =
            data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length;
          setAvgRating(avg);
          setReviewCount(data.length);
        } else {
          setAvgRating(0);
          setReviewCount(0);
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    }
    if (product._id) fetchReviews();
  }, [product._id]);

  return (
    <div className="border rounded p-3 flex flex-col">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          className="w-full h-44 object-cover rounded"
          src={
            variant.images?.[0] ||
            product.images?.[0] ||
            "https://picsum.photos/seed/p/400/300"
          }
          alt={product.name}
        />
        {product.isDeal && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
            DEAL
          </div>
        )}

        <div className="mt-3 flex-1">
          <div className="font-semibold text-sm">{product.name}</div>
          <div className="text-xs text-gray-500">{product.brand}</div>
        </div>

        <div className="flex items-center mt-1 text-yellow-500 text-sm">
          {avgRating > 0 ? (
            <>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    size={12}
                    className={`${
                      n <= Math.round(avgRating)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-gray-700 dark:text-gray-300 text-xs">
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400">No ratings yet</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="font-bold">
            Rs. {price ? price.toFixed(2) : "0.00"}
          </div>
          {originalPrice && (
            <div className="text-xs line-through text-gray-500">
              Rs. {originalPrice.toFixed(2)}
            </div>
          )}
          {discount > 0 && (
            <div className="text-xs text-red-500">{discount}% OFF</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            Quick view
          </button>
          <button
            onClick={() => {
              // add to cart — keep it simple: localStorage cart
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");
              cart.push({ ...product, qty: 1 });
              localStorage.setItem("cart", JSON.stringify(cart));
              alert("Added to cart");
            }}
            className="border px-3 py-1 rounded text-xs"
          >
            Add
          </button>
        </div>
      </div>
      {open && (
        <QuickViewModal product={product} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
