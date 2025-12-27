import { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { UserContext } from "../../context/UserContext"; // your user context

const STATUSES = ["all", "pending", "completed", "cancelled", "returned"];

export default function MyOrders() {
  const { user } = useContext(UserContext); // get current logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // review state
  const [reviewingItem, setReviewingItem] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // localStorage key for this user
  const reviewsKey = user?.email ? `myReviews_${user.email}` : null;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/orders"); // token sent via axios interceptor
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.email) fetchOrders();
  }, [user]);

  function hasReviewed(productId) {
    if (!reviewsKey) return false;
    const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    return reviews.some((r) => r.productId === productId);
  }

  function submitReview() {
    if (!rating || !comment) {
      alert("Fill rating and comment 😤");
      return;
    }
    if (!reviewsKey) return;

    const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
    reviews.push({
      orderId: reviewingItem.orderId,
      productId: reviewingItem.productId,
      productName: reviewingItem.productName,
      rating,
      comment,
      date: new Date(),
    });
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));

    alert("Review saved 🔥");

    setReviewingItem(null);
    setRating("");
    setComment("");
  }

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  if (loading) return <p style={{ padding: "20px" }}>Loading your orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>My Orders</h2>

      {/* STATUS TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: selectedStatus === status ? "#222" : "transparent",
              color: selectedStatus === status ? "#fff" : "#000",
              textTransform: "capitalize",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && <p>No orders found 😶</p>}

      {filteredOrders.map((order) => (
        <div
          key={order.orderId}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "25px",
          }}
        >
          {/* ORDER INFO */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Order ID:</strong> {order.orderId} <br />
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  order.status === "pending"
                    ? "orange"
                    : order.status === "completed"
                    ? "green"
                    : order.status === "cancelled"
                    ? "red"
                    : "purple",
                fontWeight: "bold",
              }}
            >
              {order.status}
            </span>
            <br />
            <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
          </div>

          {/* CUSTOMER INFO */}
          <div
            style={{
              background: "#f8f8f8",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>

          {/* PRODUCTS */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {order.products.map((item, index) => {
              const reviewed = hasReviewed(item.productInfo.productId);
              const image = item.productInfo.images?.[0];

              return (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  {image && (
                    <img
                      src={image}
                      alt={item.productInfo.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginRight: "10px",
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <strong>{item.productInfo.name}</strong>
                    <div>
                      Qty: {item.quantity} — Rs. {item.productInfo.price}
                    </div>
                  </div>

                  {order.status === "completed" && !reviewed && (
                    <button
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                      onClick={() =>
                        setReviewingItem({
                          orderId: order.orderId,
                          productId: item.productInfo.productId,
                          productName: item.productInfo.name,
                        })
                      }
                    >
                      Review ✍️
                    </button>
                  )}

                  {reviewed && (
                    <span style={{ color: "green", fontSize: "12px" }}>
                      ✔ Reviewed
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <strong>Total:</strong> Rs. {order.total}
        </div>
      ))}

      {/* REVIEW MODAL */}
      {reviewingItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Review {reviewingItem.productName}</h3>

            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating (1–5)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <button onClick={submitReview}>Submit</button>
            <button
              onClick={() => setReviewingItem(null)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
