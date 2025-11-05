import React, { useState, useEffect } from "react";
import { API } from "../api";

export default function Checkout({ token }) {
  const [cart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    // PayHere event handlers
    if (window.payhere) {
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. Order ID:", orderId);
        alert("Payment successful! Order ID: " + orderId);
        window.location.href = "/pay/success";
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        alert("Payment dismissed");
        window.location.href = "/pay/cancel";
      };

      window.payhere.onError = function onError(error) {
        console.error("Payment error:", error);
        alert("Payment failed: " + error);
      };
    }
  }, []);

  function pay() {
    // Prevent calling PayHere if script not loaded
    if (!window.payhere) {
      alert("PayHere SDK not loaded. Please refresh and try again.");
      return;
    }

    fetch(`${API}/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart, subtotal }),
    })
      .then((r) => r.json())
      .then((order) => {
        
        const payment = {
          sandbox: true,
          merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
          return_url: window.location.origin + "/pay/success",
          cancel_url: window.location.origin + "/pay/cancel",
          notify_url: `${API}/api/orders/payhere-notify`,
          order_id: order.orderId,
          items: "Cart Checkout",
          amount: subtotal.toFixed(2),
          currency: "LKR",
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
          phone: "0771234567",
          address: "Colombo",
          city: "Colombo",
          country: "Sri Lanka",
        };

        console.log("Initiating payment:", payment);
        window.payhere.startPayment(payment);
      })
      .catch((err) => {
        console.error("Order creation failed:", err);
        alert("Failed to create order. Please try again.");
      });
  }

  return (
    <div className="container p-6">
      <h2 className="text-2xl mb-4">Checkout</h2>
      <div className="mb-4">Total: Rs. {subtotal.toFixed(2)}</div>
      <button
        onClick={pay}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay with PayHere
      </button>
    </div>
  );
}
