import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

function CheckoutForm({ cart, name, phone, address, orderTotal, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create Stripe payment intent
      const { data } = await api.post("/payment/create-payment-intent", {
        amount: orderTotal,
      });

      const clientSecret = data.client_secret;

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // 🎉 Nice success popup
        toast.success(
          <div className="flex flex-col items-center">
            <span className="text-3xl">🎉</span>
            <strong>Payment Successful!</strong>
            <p>Your order has been placed.</p>
          </div>,
          {
            duration: 5000,
            style: { background: "#4ade80", color: "#000", padding: "16px", borderRadius: "12px" },
          }
        );

        // Save order to backend
        await api.post("/orders", {
          name,
          phone,
          address,
          products: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          total: orderTotal,
        });

        toast.success("Order saved successfully!");

        // Remove paid items from cart
        onPaymentSuccess(cart.map((item) => item.productId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment or order saving failed.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold mb-4">Card Payment</h2>
      <CardElement className="border p-2 rounded-md mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 p-3 rounded-lg font-bold text-white ${
          loading ? "bg-gray-400" : "bg-accent hover:bg-secondary"
        }`}
      >
        {loading ? "Processing..." : `Pay Rs.${orderTotal}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, name, phone, address, orderTotal } = location.state || {};

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No items to pay for. Please add items to your cart first.</p>
      </div>
    );
  }

  const handlePaymentSuccess = async (paidProductIds) => {
    try {
      await api.put("/users/cart/remove-purchased", { productIds: paidProductIds });
      toast.success("Paid items removed from cart");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update cart after payment");
    }
  };

  return (
    <div className="min-h-screen flex gap-6 p-6">
      {/* LEFT: Order Summary */}
      <div className="flex-1 bg-white shadow-2xl rounded-2xl p-6 sticky top-6">
        <h2 className="text-xl font-bold mb-4 text-secondary">Order Summary</h2>

        <div className="mb-4">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Address:</strong> {address}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items:</h3>
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between mb-1">
              <span>{item.name} x {item.qty}</span>
              <span>Rs. {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>Rs. {orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* RIGHT: Card Payment */}
      <div className="w-[400px] bg-white shadow-2xl rounded-2xl p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            cart={cart}
            name={name}
            phone={phone}
            address={address}
            orderTotal={orderTotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
