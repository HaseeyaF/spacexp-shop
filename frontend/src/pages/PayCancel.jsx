import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PayCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">
        Payment Canceled
      </h1>
      <p className="text-gray-700 mb-6">
        Your payment was canceled or not completed. You can try again anytime.
      </p>
      <Link
        to="/checkout"
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Go Back to Checkout
      </Link>
    </div>
  );
}
