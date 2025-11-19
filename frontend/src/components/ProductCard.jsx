import React, { useState } from "react";
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

  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-3 flex flex-col bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`product/${product.slug || product._id}`)}
      >
        {/* ✅ Product image + video */}
        <div className="relative">
          {/* Image */}
          {variant?.images?.[0] ? (
            <img
              src={variant.images[0]}
              alt={product.name}
              className="w-full h-44 object-cover rounded"
            />
          ) : (
            <img
              src={
                product.image ||
                product.images?.[0] ||
                "https://picsum.photos/seed/p/400/300"
              }
              alt={product.name}
              className="w-full h-44 object-cover rounded"
            />
          )}

          {/* Video (optional) */}
          {variant?.video && (
            <video
              controls
              className="w-full h-40 mt-1 rounded"
              poster={variant?.images?.[0]}
            >
              <source src={variant.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Deal badge */}
          {product.isDeal && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
              DEAL
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div className="mt-3 flex-1">
          <div className="font-semibold text-sm truncate">{product.name}</div>
          <div className="text-xs text-gray-500">{product.brand}</div>

          {/* Rating */}
          {typeof product.rating === "number" ||
          typeof product.rating === "string" ? (
            <div className="flex items-center mt-1 text-yellow-500 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.round(Number(product.rating)) ? "★" : "☆"}
                </span>
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-300 text-xs">
                ({product.totalRatings || 0})
              </span>
            </div>
          ) : (
            <div className="mt-1 text-gray-400 text-xs italic">
              No ratings yet
            </div>
          )}
        </div>

        {/* ✅ Price + Delivery + Actions */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Price */}
          <div>
            <div className="font-bold text-gray-900 dark:text-white">
              Rs. {price.toFixed(2)}
            </div>

            {originalPrice > 0 && (
              <div className="text-xs line-through text-gray-500">
                Rs. {originalPrice.toFixed(2)}
              </div>
            )}

            {discount > 0 && (
              <div className="text-xs text-red-500">{discount}% OFF</div>
            )}
          </div>

          {/* Delivery info (only if available) */}
          {(variant?.deliveryDate ||
            variant?.deliveryTime ||
            variant?.deliveryCharge) && (
            <div className="text-xs text-gray-600 dark:text-gray-300 border-t pt-2 mt-1">
              {variant?.deliveryDate && <p>Delivery: {variant.deliveryDate}</p>}
              {variant?.deliveryTime && <p>Time: {variant.deliveryTime}</p>}
              {variant?.deliveryCharge !== undefined && (
                <p>Charge: Rs. {variant.deliveryCharge}</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
        >
          Quick view
        </button>
      </div>

      {/* Quick View Modal */}
      {open && (
        <QuickViewModal product={product} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
