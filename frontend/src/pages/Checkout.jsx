import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Checkout() {
  //console.log("Token at checkout:", token);
  const [cart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.variant?.price ?? item.basePrice ?? item.price ?? 0) *
        (item.quantity ?? 1),
    0
  );

  // ---------------- Promo States ----------------
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState(null);
  const [promoError, setPromoError] = useState("");

  async function applyPromo() {
    try {
      const res = await axios.post(`/api/promo/validate`, {
        code: promoCode,
        userId: localStorage.getItem("userId") || null,
        subtotal,
      });

      setPromoResult(res.data);
      setPromoError("");
    } catch (err) {
      setPromoResult(null);
      setPromoError(err.response?.data?.error || "Invalid promo code");
    }
  }

  const discount = promoResult?.discount || 0;
  const finalTotal = subtotal - discount;

  // ---------------- PayHere Triggers ----------------
  useEffect(() => {
    window.payhere.onCompleted = function (orderId) {
      console.log("Payment completed. Order ID:", orderId);
      window.location.href = "/pay/success";
    };

    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
      window.location.href = "/pay/cancel";
    };

    window.payhere.onError = function (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with payment.");
    };
  }, []);

  function pay() {
    fetch(`/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items: cart, subtotal, discount, finalTotal }),
    })
      .then((r) => r.json())
      .then((order) => {
        console.log("Order created:", order);
        const payment = {
          sandbox: true,
          merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
          return_url: window.location.origin + "/pay/success",
          cancel_url: window.location.origin + "/pay/cancel",
          notify_url: `/api/orders/payhere-notify`,
          order_id: order.orderId,
          items: "Cart Checkout",
          amount: finalTotal.toFixed(2),
          currency: "LKR",
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
          phone: "0771234567",
          address: "Colombo",
          city: "Colombo",
          country: "Sri Lanka",
        };
        window.payhere.startPayment(payment);
      })
      .catch((err) => console.error("Order Create error:", err));
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => {
              const variant = item.variant || {};
              const price = Number(
                variant.price ?? item.basePrice ?? item.price ?? 0
              );
              const size = item.selectedSize?.sizeLabel || "—";
              const color = variant.color || "—";
              const image =
                variant.images?.[0] ||
                item.images?.[0] ||
                "https://picsum.photos/seed/default/200";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Size: {size} | Color: {color}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Rs.{" "}
                        {price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity ?? 1}
                      </p>
                    </div>
                  </div>

                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    Rs.{" "}
                    {(price * (item.quantity ?? 1)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------------- Promo Code Section ---------------- */}
          <div className="mt-4 border p-4 rounded bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-2">Apply Promo Code</h3>

            <div className="flex gap-2">
              <input
                className="border p-2 flex-1 rounded dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                onClick={applyPromo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>

            {promoError && (
              <p className="text-red-500 text-sm mt-2">{promoError}</p>
            )}

            {promoResult && (
              <p className="text-green-600 text-sm mt-2">
                🎉 Promo applied! You saved Rs. {promoResult.discount}
              </p>
            )}
          </div>

          {/* ---------------- Total Section ---------------- */}
          <div className="flex justify-between items-center border-t pt-4">
            <h3 className="text-xl font-bold">Total</h3>

            <div className="text-right">
              {promoResult && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Discount: - Rs.{" "}
                  {promoResult.discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}

              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                Rs.{" "}
                {finalTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={pay}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Pay with PayHere
            </button>
          </div>
        </>
      )}
    </div>
  );
}
