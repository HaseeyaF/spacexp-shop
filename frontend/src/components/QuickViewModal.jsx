import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { API } from "../api";
import { AiOutlineHeart } from "react-icons/ai";
import SizeChart from "./SizeChart";

export default function QuickViewModal({ product, onClose }) {
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0] || {}
  );
  const [mainImage, setMainImage] = useState(
    activeVariant.images?.[0] || product.images?.[0] || ""
  );

  const price = activeVariant.price ?? product.basePrice ?? 0;
  const originalPrice =
    activeVariant.originalPrice ?? product.originalPrice ?? null;
  const images = activeVariant.images || [];
  const video = activeVariant.video;
  const deliveryDate = activeVariant.deliveryDate || "-";
  const deliveryTime = activeVariant.deliveryTime || "-";
  const deliveryCharge = activeVariant.deliveryCharge || 0;

  // Fetch reviews
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

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variant = product.variants.find((v) => v.color === color);
    setActiveVariant(variant);
    setSelectedSize("");
    setMainImage(variant.images?.[0] || "");
  };

  const handleSizeSelect = (size) => setSelectedSize(size);

  // Add to cart
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
    <div
      className={
        onClose
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          : ""
      }
    >
      <div
        className={`bg-white p-4 rounded w-full ${
          onClose ? "md:w-3/4 lg:w-1/2" : ""
        }`}
      >
        {onClose && (
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <button onClick={onClose} className="text-gray-600">
              X
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          {/* LEFT: Images */}
          <div className="md:w-1/2">
            {onClose && (
              <div>
                {/* Main Image */}
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full rounded object-cover mb-2"
                  />
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name}-${idx}`}
                        className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                          mainImage === img
                            ? "border-blue-600"
                            : "border-gray-300"
                        }`}
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                  </div>
                )}

                {/* Video */}
                {video && (
                  <video controls className="w-full rounded mt-2">
                    <source src={video} type="video/mp4" />
                  </video>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex-1">
            {onClose && (
              <p className="text-sm text-gray-700">{product.description}</p>
            )}

            {/* Ratings */}
            {onClose && (
              <div className="flex items-center mt-1 text-yellow-500 text-sm">
                {avgRating > 0 ? (
                  <>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <FaStar
                          key={n}
                          size={12}
                          className={
                            n <= Math.round(avgRating)
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
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
            )}

            {/* Price */}
            {onClose && (
              <div className="mt-3">
                <div className="font-bold">Rs. {price.toFixed(2)}</div>
                {originalPrice && (
                  <div className="text-xs line-through text-gray-500">
                    Rs. {originalPrice.toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Delivery */}
            <div className="mt-3 text-sm text-gray-700">
              <p>Delivery Date: {deliveryDate}</p>
              <p>Delivery Time: {deliveryTime}</p>
              <p>Delivery Charge: Rs. {deliveryCharge}</p>
            </div>

            {/* Color Selection */}
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

            {/* Size Selection */}
            {activeVariant?.sizes?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1">Size:</h4>
                <div className="flex gap-2">
                  {activeVariant.sizes.map((s) => (
                    <button
                      key={s.sizeLabel}
                      onClick={() => handleSizeSelect(s.sizeLabel)}
                      disabled={s.stock <= 0}
                      className={`px-3 py-1 border rounded text-sm font-medium cursor-pointer ${
                        selectedSize === s.sizeLabel
                          ? "border-blue-600 bg-blue-100"
                          : "border-gray-300 bg-white"
                      } ${s.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {s.sizeLabel}
                      {s.stock <= 0 ? " (Out of stock)" : ""}
                    </button>
                  ))}
                </div>
                <SizeChart sizes={activeVariant.sizes} />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded" >
                Add to cart
              </button>
              <button onClick={handleAddToWishlist} className="border px-4 py-2 rounded" >
                <AiOutlineHeart size={22} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
