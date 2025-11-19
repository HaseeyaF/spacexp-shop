import React, { useEffect, useState } from "react";
import { API } from "../../api";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/promo`)
      .then(res => res.json())
      .then(data => setPromos(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Promo Codes</h2>

      <button className="bg-green-600 text-white px-4 py-2 mb-4">
        + Create Promo
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Uses</th>
          </tr>
        </thead>

        <tbody>
          {promos.map(p => (
            <tr key={p._id}>
              <td>{p.code}</td>
              <td>{p.discountType}</td>
              <td>{p.discountValue}</td>
              <td>{p.uses}/{p.maxUses}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
