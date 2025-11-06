{
  /** 
import React, { useState } from "react";
import Reviews from "./Reviews";

export default function QuickViewModal({ product, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(
      (item) =>
        item._id === product._id &&
        (item.size || "") === (selectedSize || "") &&
        (item.color || "") === (selectedColor || "")
    );

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0],
        brand: product.brand,
        category: product.category,
        size: selectedSize || null,
        color: selectedColor || null,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const handleAddToWishlist = () => {
    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");

    // avoid duplicates with size + color
    const exists = wl.find(
      (item) =>
        item._id === product._id &&
        (item.size || "") === (selectedSize || "") &&
        (item.color || "") === (selectedColor || "")
    );

    if (!exists) {
      wl.push({
        ...product,
        size: selectedSize || null,
        color: selectedColor || null,
      });
      localStorage.setItem("wishlist", JSON.stringify(wl));
      alert("Added to wishlist");
    } else {
      alert("Already in wishlist");
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded w-11/12 md:w-3/4 lg:w-1/2">
        {/* Header /}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-black dark:text-white">
            {product.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            X
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Image slider /}
          <div className="relative w-full md:w-1/3">
            <img
              src={product.images?.[currentIndex]}
              alt={product.name}
              className="w-full h-64 md:h-48 object-cover rounded"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-0 -translate-y-1/2 bg-black/30 text-white p-1 rounded hover:bg-black/50 transition"
                >
                  &lt;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/30 text-white p-1 rounded hover:bg-black/50 transition"
                >
                  &gt;
                </button>
              </>
            )}
          </div>

          {/* Product info /}
          <div className="flex-1 text-black dark:text-white">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
            <div className="mt-3">
              <div className="font-bold text-black dark:text-white">
                ${product.price.toFixed(2)}
              </div>
              {product.originalPrice && (
                <div className="text-xs line-through text-gray-500 dark:text-gray-400">
                  ${product.originalPrice.toFixed(2)}
                </div>
              )}
            </div>

            {/* Size Selector /}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-3">
                <label className="text-xs font-medium">Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="ml-2 border rounded text-xs px-2 py-1
                             bg-white text-gray-800
                             dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selector /}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-3">
                <label className="text-xs font-medium">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="ml-2 border rounded text-xs px-2 py-1
                             bg-white text-gray-800
                             dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                >
                  {product.colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons /}
            {/* Buttons /}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add to cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="border px-4 py-2 rounded"
              >
                Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Reviews /}
        <Reviews productId={product._id} />
      </div>
    </div>
  );
}
*/
}

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { API } from "../api";

export default function QuickViewModal({ product, onClose }) {
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0] || {}
  );

  // Derive info from active variant
  const price = activeVariant.price ?? product.basePrice ?? 0;
  const originalPrice =
    activeVariant.originalPrice ?? product.originalPrice ?? null;
  const image =
    activeVariant.images?.[0] ||
    product.images?.[0] ||
    "https://picsum.photos/seed/p/400/300";

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

  // Handle color change
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variant = product.variants.find((v) => v.color === color);
    setActiveVariant(variant);
    setSelectedSize(""); // reset size on color change
  };

  // Handle size select
  const handleSizeSelect = (e) => {
    setSelectedSize(e.target.value);
  };

  // Validate and add to cart
  const handleAddToCart = () => {
    const requiresColor = product.variants?.length > 0;
    const requiresSize = activeVariant?.sizes?.length > 0;

    if ((requiresColor && !selectedColor) || (requiresSize && !selectedSize)) {
      alert(
        requiresColor && requiresSize
          ? "Please select color and size first."
          : requiresColor
          ? "Please select a color first."
          : "Please select required options."
      );
      return;
    }

    const selectedVariant = selectedColor
      ? product.variants.find((v) => v.color === selectedColor)
      : activeVariant;

    const selectedSizeObj =
      requiresSize && selectedSize
        ? selectedVariant.sizes.find((s) => s.sizeLabel === selectedSize)
        : null;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      ...product,
      variant: selectedVariant,
      selectedSize: selectedSizeObj,
      qty: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  // Validate and add to wishlist
  const handleAddToWishlist = () => {
    const requiresColor = product.variants?.length > 0;
    const requiresSize = activeVariant?.sizes?.length > 0;

    if ((requiresColor && !selectedColor) || (requiresSize && !selectedSize)) {
      alert(
        requiresColor && requiresSize
          ? "Please select color and size first."
          : requiresColor
          ? "Please select a color first."
          : "Please select required options."
      );
      return;
    }

    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wl.find((i) => i._id === product._id)) {
      wl.push({
        ...product,
        selectedColor,
        selectedSize,
      });
      localStorage.setItem("wishlist", JSON.stringify(wl));
      alert("Added to wishlist");
    } else {
      alert("Already in wishlist");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded w-11/12 md:w-3/4 lg:w-1/2">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <button onClick={onClose} className="text-gray-600">
            X
          </button>
        </div>
        <div className="flex gap-4">
          <img
            src={image}
            alt={product.name}
            className="w-1/3 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700">{product.description}</p>

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

            {/* Price */}
            <div className="mt-3">
              <div className="font-bold">Rs. {price.toFixed(2)}</div>
              {originalPrice && (
                <div className="text-xs line-through text-gray-500">
                  Rs. {originalPrice.toFixed(2)}
                </div>
              )}
            </div>

            {/* ✅ Color Selection */}
            {product.variants?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1">Select Color:</h4>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.color}
                      title={v.color}
                      style={{ backgroundColor: v.colorCode }}
                      onClick={() => handleColorSelect(v.color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === v.color
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Size Selection */}
            {activeVariant?.sizes?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1">Select Size:</h4>
                <select
                  value={selectedSize}
                  onChange={handleSizeSelect}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select a size</option>
                  {activeVariant.sizes.map((s) => (
                    <option
                      key={s.sizeLabel}
                      value={s.sizeLabel}
                      disabled={s.stock <= 0}
                    >
                      {s.sizeLabel} {s.stock <= 0 ? "(Out of stock)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add to cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="border px-4 py-2 rounded"
              >
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
