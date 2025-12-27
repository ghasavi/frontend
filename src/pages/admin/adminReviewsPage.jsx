import { useEffect, useState } from "react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myReviews")) || [];
    setReviews(stored);
  }, []);

  function saveReviews(updated) {
    localStorage.setItem("myReviews", JSON.stringify(updated));
    setReviews(updated);
  }

  function deleteReview(index) {
    if (!window.confirm("Delete this review?")) return;
    const updated = [...reviews];
    updated.splice(index, 1);
    saveReviews(updated);
  }

  function toggleHide(index) {
    const updated = [...reviews];
    updated[index].hidden = !updated[index].hidden;
    saveReviews(updated);
  }

  if (reviews.length === 0) {
    return <p style={{ padding: "20px" }}>No reviews yet 👀</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin – Manage Reviews</h2>

      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            opacity: review.hidden ? 0.5 : 1,
          }}
        >
          <p><strong>Product:</strong> {review.productName}</p>
          <p><strong>Rating:</strong> ⭐ {review.rating} / 5</p>
          <p><strong>Comment:</strong> {review.comment}</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            Order: {review.orderId} <br />
            Date: {new Date(review.date).toLocaleDateString()}
          </p>

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => toggleHide(index)}>
              {review.hidden ? "Unhide" : "Hide"}
            </button>

            <button
              onClick={() => deleteReview(index)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
