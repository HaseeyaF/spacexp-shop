import React, { useEffect, useState } from "react";
import { API } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/orders/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {orders.map(o => (
        <div key={o._id} className="p-4 border mb-4">
          <p><b>Order ID:</b> {o._id}</p>
          <p><b>Total:</b> Rs. {o.total}</p>
          <p><b>Status:</b> {o.orderStatus}</p>
        </div>
      ))}
    </div>
  );
}
