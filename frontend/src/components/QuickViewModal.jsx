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

import React from "react";

export default function QuickViewModal({ product, onClose }) {
  
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
            src={product.images?.[0]}
            alt=""
            className="w-1/3 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700">{product.description}</p>
            <div className="mt-3">
              <div className="font-bold">${product.price.toFixed(2)}</div>
              {product.originalPrice && (
                <div className="text-xs line-through text-gray-500">
                  ${product.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                  cart.push({ ...product, qty: 1 });
                  localStorage.setItem("cart", JSON.stringify(cart));
                  alert("Added to cart");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add to cart
              </button>
              <button
                onClick={() => {
                  const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
                  // avoid duplicates
                  if (!wl.find((i) => i._id === product._id)) {
                    wl.push(product);
                    localStorage.setItem("wishlist", JSON.stringify(wl));
                    alert("Added to wishlist");
                  } else {
                    alert("Already in wishlist");
                  }
                }}
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
