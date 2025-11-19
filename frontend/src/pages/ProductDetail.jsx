import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api";

export default function ProductDetail() {
  const { id } = useParams(); // gets the product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full max-w-md mt-4"
      />
      <p className="mt-2">Brand: {product.brand}</p>
      <p className="mt-2 font-bold">Price: Rs. {product.price?.toFixed(2)}</p>
      <p className="mt-2">{product.description}</p>
    </div>
  );
}
