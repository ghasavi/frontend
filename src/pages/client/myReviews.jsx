import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function MyReviews() {
  const { user } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);

  // key for this user's reviews in localStorage
  const reviewsKey = user?.email ? `myReviews_${user.email}` : null;

  useEffect(() => {
    if (!reviewsKey) return;
    const storedReviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    setReviews(storedReviews);
  }, [reviewsKey]);

  if (reviews.length === 0) {
    return <p style={{ padding: "20px" }}>No reviews yet 👀</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Reviews</h2>

      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p><strong>Product:</strong> {review.productName}</p>
          <p><strong>Rating:</strong> ⭐ {review.rating} / 5</p>
          <p><strong>Comment:</strong> {review.comment}</p>
          <p style={{ fontSize: "12px", color: "#777" }}>
            Reviewed on {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
