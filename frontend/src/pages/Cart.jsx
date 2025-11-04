import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);

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
  const handleRemoveOne = (id, size, color) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id &&
        (item.size || "") === (size || "") &&
        (item.color || "") === (color || "")
          ? item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : null
          : item
      )
      .filter(Boolean);
    updateLocalStorage(updatedCart);
  };

  // Increase qty
  const handleIncrease = (id, size, color) => {
    const updatedCart = cart.map((item) =>
      item._id === id &&
      (item.size || "") === (size || "") &&
      (item.color || "") === (color || "")
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
    toast.success("Redirecting to checkout...");
    // Navigate to checkout page here
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={`${item._id}-${item.size || "nosize"}-${
                  item.color || "nocolor"
                }`}
                className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
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
                      Size: {item.size || "—"} | Color: {item.color || "—"}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Qty Controls */}
                <div className="mt-2 md:mt-0 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleRemoveOne(item._id, item.size, item.color)
                    }
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity ?? 1}</span>
                  <button
                    onClick={() =>
                      handleIncrease(item._id, item.size, item.color)
                    }
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <h3 className="text-xl font-bold text-black dark:text-white">
              Total: Rs. {totalPrice.toLocaleString()}
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
