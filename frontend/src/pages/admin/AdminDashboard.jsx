import React, { useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminPromos from "./AdminPromos";
import AdminContent from "./AdminContent";

export default function AdminDashboard() {
  const [page, setPage] = useState("products");

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <ul className="space-y-3">
          <li onClick={() => setPage("products")} className="cursor-pointer hover:text-yellow-400">
            Products
          </li>
          <li onClick={() => setPage("users")} className="cursor-pointer hover:text-yellow-400">
            Users
          </li>
          <li onClick={() => setPage("orders")} className="cursor-pointer hover:text-yellow-400">
            Orders
          </li>
          <li onClick={() => setPage("promos")} className="cursor-pointer hover:text-yellow-400">
            Promo Codes
          </li>
          <li onClick={() => setPage("content")} className="cursor-pointer hover:text-yellow-400">
            Content Manager
          </li>
        </ul>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 overflow-y-scroll">
        {page === "products" && <AdminProducts />}
        {page === "users" && <AdminUsers />}
        {page === "orders" && <AdminOrders />}
        {page === "promos" && <AdminPromos />}
        {page === "content" && <AdminContent />}
      </div>

    </div>
  );
}
