import { useEffect, useState } from "react";
import { API } from "../api";
import { FaStar } from "react-icons/fa";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });

  useEffect(() => {
    fetch(`${API}/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(console.error);
  }, [productId]);

  async function submitReview(e) {
    e.preventDefault();
    if (form.rating === 0) {
      alert("Please select a rating");
      return;
    }
    await fetch(`${API}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });
    setForm({ name: "", rating: 0, comment: "" });
    // refresh reviews
    const res = await fetch(`${API}/api/reviews?productId=${productId}`);
    setReviews(await res.json());
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Reviews
      </h3>

      {/* Review Form */}
      <form onSubmit={submitReview} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full rounded 
                     bg-white text-gray-900
                     dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Star rating */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              size={24}
              className={`cursor-pointer transition-colors ${
                n <= form.rating
                  ? "text-yellow-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
              onClick={() => setForm({ ...form, rating: n })}
            />
          ))}
        </div>

        <textarea
          className="border p-2 w-full rounded 
                     bg-white text-gray-900
                     dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          placeholder="Write a comment..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 
                     text-white px-4 py-2 rounded transition"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="border p-2 rounded
                       bg-gray-50 text-gray-900
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          >
            <div className="font-semibold flex items-center gap-2">
              {r.name}
              <span className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    size={16}
                    className={
                      n <= r.rating
                        ? "text-yellow-400"
                        : "text-gray-400 dark:text-gray-600"
                    }
                  />
                ))}
              </span>
            </div>
            <div className="text-sm">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
