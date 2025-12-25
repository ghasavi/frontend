import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios"; // ✅ use your axios instance

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { cart, name, phone, address, orderTotal, email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create Stripe payment intent
      const { data } = await api.post("/payment/create-payment-intent", {
        amount: orderTotal, // in rupees
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
        toast.success("Payment successful!");

        // Save order to backend
        await api.post("/orders", {
          name,
          phone,
          address,
          email,
          products: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          total: orderTotal,
        });

        toast.success("Order saved successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment or order saving failed.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold">Pay Now</h2>
      <CardElement className="border p-2 rounded-md" />
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
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
