import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

// …imports stay the same

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
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/payment/create-payment-intent",
        { amount: orderTotal } // rupees
      );

      console.log("Payment intent response:", data); // <-- add this
      const clientSecret = data.client_secret; // matches backend now

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
        const token = localStorage.getItem("token");
        await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/orders",
          {
            orderId: result.paymentIntent.id,
            email: email || "guest@example.com",
            name,
            phone,
            address,
            status: "paid",
            labelledTotal: cart.reduce((sum, item) => sum + (item.labelledPrice || item.price) * item.qty, 0),
            total: orderTotal,
            products: cart.map(item => ({
              productInfo: {
                productId: item.productId,
                name: item.name,
                altNames: item.altNames || [],
                description: item.description,
                images: item.image ? [item.image] : [],
                labelledPrice: item.labelledPrice || item.price,
                price: item.price
              },
              quantity: item.qty
            }))
          },
          {
            headers: token ? { Authorization: "Bearer " + token } : {},
          }
        );

        console.log("Order saved successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment or order saving failed.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Pay Now</h2>
      <CardElement className="border p-2 rounded-md" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 p-3 rounded-lg font-bold text-white ${loading ? "bg-gray-400" : "bg-accent hover:bg-secondary"}`}
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
