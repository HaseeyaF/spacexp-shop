// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import QuickViewModal from "../components/QuickViewModal";
import Reviews from "../components/Reviews";
import TryOn from "../components/TryOn";

export default function ProductDetail() {
  const { id } = useParams(); // product _id or slug from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedVariant(res.data.variants?.[0] || null); // default to first variant
      } catch (err) {
        console.error(err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return null;

  const avgRating = product.rating || 0;
  const reviewCount = product.reviews?.length || 0;

  // Determine main media: video > 3D model > image
  const renderMainMedia = () => {
    if (selectedVariant?.video) {
      return (
        <video
          src={selectedVariant.video}
          controls
          className="w-full h-96 object-cover rounded"
        />
      );
    } else if (selectedVariant?.model3d) {
      return (
        <model-viewer
          src={selectedVariant.model3d}
          ar
          auto-rotate
          camera-controls
          className="w-full h-96 rounded"
        ></model-viewer>
      );
    } else if (selectedVariant?.images?.[0]) {
      return (
        <img
          src={selectedVariant.images[0]}
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />
      );
    } else {
      return (
        <img
          src="https://picsum.photos/seed/p/600/400"
          alt={product.name}
          className="w-full h-96 object-cover rounded"
        />
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Media */}
        <div className="md:w-1/2">
          {renderMainMedia()}

          {/* ---- 3D + AR TryOn ---- */}
          {selectedVariant?.model3d && (
            <div className="mt-4">
              <TryOn variant={selectedVariant} />
            </div>
          )}

          {/* Thumbnail selector */}
          {selectedVariant?.images?.length > 1 && (
            <div className="flex gap-2 mt-2">
              {selectedVariant.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer"
                  onClick={() =>
                    setSelectedVariant({ ...selectedVariant, images: [img] })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar
                key={n}
                size={16}
                className={
                  n <= Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-gray-700 text-sm ml-2">
              {avgRating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-800">{product.description}</p>

          {/* Variant Selection */}
          {product.variants?.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Variants</h2>
              <div className="flex gap-4 flex-wrap">
                {product.variants.map((v, i) => (
                  <div
                    key={i}
                    className={`border p-2 rounded cursor-pointer ${
                      selectedVariant === v ? "border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    <div className="text-sm font-medium">{v.color}</div>
                    {v.originalPrice && (
                      <div className="text-gray-500 line-through text-xs">
                        Rs. {v.originalPrice?.toFixed(2)}
                      </div>
                    )}
                    <div className="text-lg font-bold">
                      Rs. {v.price?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category & Tags */}
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Category & Tags</h2>
            <p className="text-gray-600">{product.category}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {product.tags?.map((tag, i) => (
                <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ QuickViewModal for Add to Cart / Wishlist */}
      <div className="mt-6">
        <QuickViewModal product={product} />
      </div>

      {/* Similar Products */}
      {product.similarProducts?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.similarProducts.map((p) => (
              <div key={p._id} className="border p-2 rounded">
                <img
                  src={
                    p.variants?.[0]?.images?.[0] ||
                    "https://picsum.photos/seed/p/200/200"
                  }
                  alt={p.name}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="text-sm font-medium mt-1">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <Reviews productId={product._id} />
      </div>
    </div>
  );
}
