import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    toast.success("Cart updated!");
  };

  // Remove one qty (or delete if qty==1)
  const handleRemoveOne = (id, sizeLabel, color) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id &&
        (item.selectedSize?.sizeLabel || "") === (sizeLabel || "") &&
        (item.variant?.color || "") === (color || "")
          ? item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : null
          : item
      )
      .filter(Boolean);
    updateLocalStorage(updatedCart);
  };

  // Increase qty
  const handleIncrease = (id, sizeLabel, color) => {
    const updatedCart = cart.map((item) =>
      item._id === id &&
      (item.selectedSize?.sizeLabel || "") === (sizeLabel || "") &&
      (item.variant?.color || "") === (color || "")
        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    toast.info("Cart cleared!");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    toast.success("Redirecting to checkout...");
    setTimeout(() => {
      navigate("/checkout");
    }, 1000);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.variant?.price ?? item.basePrice ?? 0) * (item.quantity ?? 1),
    0
  );


  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Your Shopping Cart
      </h2>

      <button
        onClick={() => navigate("/wishlist")}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition"
      >
        <Heart className="w-5 h-5" />
        <span className="hidden md:inline">Wishlist</span>
      </button>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <ShoppingCart size={72} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-sm text-gray-400">
            Add some products to see them here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => {
              // 🔹 Safely get image & price from variant
              const variant = item.variant || {};
              const size = item.selectedSize?.sizeLabel || "—";
              const color = variant.color || "—";
              const price = Number(variant.price ?? item.basePrice ?? 0);
              const image =
                variant.images?.[0] ||
                item.images?.[0] ||
                "https://picsum.photos/seed/c/200";

              return (
                <div
                  key={`${item._id}-${item.size}-${item.color}`}
                  className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </p>

                      {/* Show size & color */}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Size: {size || "—"} | Color: {color || "—"}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">
                        Rs. {" "}{price.toLocaleString(undefined, { minimumFractionDigits: 2,})}
                      </p>
                    </div>
                  </div>

                  {/* Qty Controls */}
                  <div className="mt-2 md:mt-0 flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleRemoveOne(item._id, size, color)
                      }
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    >
                      −
                    </button>
                    <span className="px-3">{item.quantity ?? 1}</span>
                    <button
                      onClick={() =>
                        handleIncrease(item._id, size, color)
                      }
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <h3 className="text-xl font-bold text-black dark:text-white">
              Total: Rs.{" "}
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>

            <div className="flex gap-4">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
