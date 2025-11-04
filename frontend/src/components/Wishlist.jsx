{
  /** 
import React, { useEffect, useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("wishlist");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    }
  }, []);

  function remove(itemToRemove) {
    const newItems = items.filter(
      (i) =>
        !(
          i._id === itemToRemove._id &&
          (i.size || "") === (itemToRemove.size || "") &&
          (i.color || "") === (itemToRemove.color || "")
        )
    );
    setItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  }

  return (
    <div className="mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Wishlist
      </h2>

      {items.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400">
          No items in wishlist
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it) => {
            const key = `${it._id}-${it.size || "nosize"}-${
              it.color || "nocolor"
            }`; // ✅ unique key per variant
            const price = isNaN(Number(it.price)) ? 0 : Number(it.price); // safe number

            return (
              <div
                className="border border-gray-300 dark:border-gray-700 p-3 rounded bg-gray-50 dark:bg-gray-800"
                key={key}
              >
                <img
                  src={it.images?.[0] || ""}
                  alt={it.name || "Item"}
                  className="w-full h-36 object-cover rounded mb-2"
                />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {it.name || "Unnamed Item"}
                </div>
                {it.size && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Size: {it.size}
                  </div>
                )}
                {it.color && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Color: {it.color}
                  </div>
                )}
                <div className="mt-2 text-gray-800 dark:text-gray-300">
                  ${price.toFixed(2)}
                </div>
                <button
                  onClick={() => remove(it)}
                  className="mt-2 border border-gray-400 dark:border-gray-600 px-3 py-1 rounded text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
  */
}

import React, { useEffect, useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const raw = localStorage.getItem("wishlist");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  
  function remove(id) {
    const newItems = items.filter((i) => i._id !== id);
    setItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  }
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      {items.length === 0 ? (
        <div>No items in wishlist</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div className="border p-3 rounded" key={it._id}>
              <img
                src={it.images?.[0]}
                alt={it.name}
                className="w-full h-36 object-cover rounded mb-2"
              />
              <div className="font-semibold">{it.name}</div>
              <div className="mt-2"> ${it.price.toFixed(2)}</div>
              <button
                onClick={() => remove(it._id)}
                className="mt-2 border px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
