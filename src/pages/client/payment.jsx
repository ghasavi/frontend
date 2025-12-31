import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Lock,
  Shield,
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  Sparkles,
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  ChevronRight,
  Gift,
  XCircle,
  AlertTriangle
} from "lucide-react";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

function CheckoutForm({ cart, name, phone, address, orderTotal, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create Stripe payment intent
      const { data } = await api.post("/payment/create-payment-intent", {
        amount: orderTotal * 100, // Convert to cents
      });

      const clientSecret = data.client_secret;

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            phone: phone,
            address: {
              line1: address,
            },
          },
        },
      });

      if (result.error) {
        toast.error(() => (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">Payment Failed</div>
              <div className="text-sm opacity-90">{result.error.message}</div>
            </div>
          </div>
        ));
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setPaymentComplete(true);
        
        // Success toast
        toast.success(() => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#81C784] flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium">Payment Successful! 🎉</div>
              <div className="text-sm opacity-90">Your payment has been processed.</div>
            </div>
          </div>
        ), {
          duration: 5000,
        });

        // Save order to backend
        try {
          const orderData = {
            name,
            phone,
            address,
            products: cart.map((item) => ({
              productId: item.productId,
              qty: item.qty,
            })),
            total: orderTotal,
            paymentId: result.paymentIntent.id,
            status: "completed"
          };

          await api.post("/orders", orderData);
          setOrderPlaced(true);
          
          toast.success(() => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2196F3] to-[#03A9F4] flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium">Order Confirmed!</div>
                <div className="text-sm opacity-90">Your items are being prepared.</div>
              </div>
            </div>
          ), {
            duration: 4000,
          });

          // Remove paid items from cart
          await onPaymentSuccess(cart.map((item) => item.productId));
          
          // Navigate after a brief delay
          setTimeout(() => {
            navigate("/myorders", { replace: true });
          }, 2000);

        } catch (orderErr) {
          console.error("Order save error:", orderErr);
          toast.error(() => (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <div className="font-medium">Payment Succeeded</div>
                <div className="text-sm opacity-90">But order save failed. Contact support.</div>
              </div>
            </div>
          ));
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(() => (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <div>
            <div className="font-medium">Payment Failed</div>
            <div className="text-sm opacity-90">Please try again or use a different card.</div>
          </div>
        </div>
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-[#5C8374]" />
          Secure Payment
        </h2>
        <Shield className="w-5 h-5 text-[#4CAF50]" />
      </div>

      {paymentComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#81C784] flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#092635] mb-2">Payment Complete!</h3>
          <p className="text-[#5C8374] mb-6">
            {orderPlaced 
              ? "Your order has been confirmed and is being processed."
              : "Processing your order..."}
          </p>
          {orderPlaced && (
            <div className="animate-pulse">
              <p className="text-sm text-[#5C8374]">Redirecting to your orders...</p>
            </div>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card details */}
          <div>
            <label className="block text-sm font-medium text-[#5C8374] mb-3">
              Card Details
            </label>
            <div className="p-4 bg-gradient-to-br from-white/80 to-white/60 border border-[#5C8374]/20 rounded-xl">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#092635',
                      fontFamily: 'inherit',
                      '::placeholder': {
                        color: '#5C8374',
                      },
                    },
                    invalid: {
                      color: '#F44336',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Security info */}
          <div className="p-4 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 rounded-xl border border-[#5C8374]/10">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#5C8374] mt-0.5" />
              <div>
                <div className="font-medium text-[#092635]">Secure Payment</div>
                <div className="text-sm text-[#5C8374]">
                  Your payment information is encrypted and secure. We never store your card details.
                </div>
              </div>
            </div>
          </div>

          {/* Accepted cards */}
          <div className="flex items-center gap-2 text-sm text-[#5C8374]">
            <span className="font-medium">Accepted Cards:</span>
            <div className="flex gap-1">
              <div className="px-2 py-1 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded text-xs">
                Visa
              </div>
              <div className="px-2 py-1 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded text-xs">
                Mastercard
              </div>
              <div className="px-2 py-1 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded text-xs">
                Amex
              </div>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
              !stripe || loading
                ? "bg-[#5C8374]/20 text-[#5C8374]/50 cursor-not-allowed"
                : "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white hover:shadow-xl hover:shadow-[#5C8374]/30"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay Rs. {orderTotal.toFixed(2)}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, name, phone, address, orderTotal, discount = 0, subTotal = 0 } = location.state || {};

  if (!cart || cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 flex items-center justify-center border border-[#5C8374]/30">
            <ShoppingBag className="w-12 h-12 text-[#5C8374]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E3FEF7] mb-3">No Items to Pay</h2>
          <p className="text-[#E3FEF7]/60 mb-6 max-w-md mx-auto">
            Your cart is empty. Please add items to your cart before proceeding to payment.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cart")}
            className="px-8 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            Back to Cart
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handlePaymentSuccess = async (paidProductIds) => {
    try {
      await api.put("/users/cart/remove-purchased", { productIds: paidProductIds });
      toast.success(() => (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
          <span>Paid items removed from cart</span>
        </div>
      ));
    } catch (err) {
      console.error("Cart update error:", err);
      toast.error(() => (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to update cart after payment</span>
        </div>
      ));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 border border-[#5C8374]/20 text-[#E3FEF7] hover:bg-gradient-to-r hover:from-[#5C8374]/20 hover:to-[#77B0AA]/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-[#E3FEF7]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#E3FEF7]">Complete Payment</h1>
              <p className="text-[#E3FEF7]/70">Final step to secure your order</p>
            </div>
          </motion.div>
          
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - Order Summary & Delivery */}
          <div className="flex-1 space-y-6">
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
            >
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-[#5C8374]" />
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#5C8374]/5 to-transparent"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-[#5C8374]/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#092635] truncate">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-[#5C8374]">
                          <span>Qty: {item.qty}</span>
                          <span>Rs. {item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#092635]">
                          Rs. {(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 border-t border-[#5C8374]/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#5C8374]">Subtotal</span>
                    <span className="font-medium text-[#092635]">
                      Rs. {subTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#5C8374] flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#4CAF50]" />
                        Discount
                      </span>
                      <span className="font-medium text-[#4CAF50]">
                        - Rs. {discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#5C8374]">Shipping</span>
                    <span className="font-medium text-[#092635]">FREE</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#5C8374]/20 to-transparent my-2"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#092635]">Total Amount</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#092635]">
                        Rs. {orderTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#5C8374]">Including all taxes</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delivery Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
            >
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#5C8374]" />
                  Delivery Information
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#5C8374]/5 to-transparent border border-[#5C8374]/10">
                    <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Name</span>
                    </div>
                    <div className="text-[#092635] font-medium">{name}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#5C8374]/5 to-transparent border border-[#5C8374]/10">
                    <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <div className="text-[#092635] font-medium">{phone}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#5C8374]/5 to-transparent border border-[#5C8374]/10">
                  <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Delivery Address</span>
                  </div>
                  <div className="text-[#092635] font-medium">{address}</div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF9800]/5 to-transparent border border-[#FF9800]/10">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-[#FF9800] mt-0.5" />
                    <div>
                      <div className="font-bold text-[#092635]">Estimated Delivery</div>
                      <div className="text-sm text-[#5C8374]">
                        Your order will be delivered in 2-4 business days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-2xl shadow-[#003C43]/10 overflow-hidden">
                <Elements stripe={stripePromise}>
                  <div className="p-6">
                    <CheckoutForm
                      cart={cart}
                      name={name}
                      phone={phone}
                      address={address}
                      orderTotal={orderTotal}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </div>
                </Elements>

                {/* Security & Guarantee */}
                <div className="p-6 border-t border-[#5C8374]/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#4CAF50]" />
                    <div>
                      <div className="font-bold text-[#092635]">SSL Secure Payment</div>
                      <div className="text-sm text-[#5C8374]">256-bit encryption</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                    <div>
                      <div className="font-bold text-[#092635]">Money-Back Guarantee</div>
                      <div className="text-sm text-[#5C8374]">30-day return policy</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#5C8374]" />
                    <div>
                      <div className="font-bold text-[#092635]">Instant Confirmation</div>
                      <div className="text-sm text-[#5C8374]">Order confirmed immediately</div>
                    </div>
                  </div>
                </div>

                {/* Need help */}
                <div className="p-6 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
                  <div className="text-center">
                    <p className="text-sm text-[#5C8374] mb-2">Need help with your payment?</p>
                    <button
                      onClick={() => toast.success(() => (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Support team will contact you shortly! 📞</span>
                        </div>
                      ))}
                      className="text-sm text-[#5C8374] hover:text-[#77B0AA] transition-colors"
                    >
                      Contact Support →
                    </button>
                  </div>
                </div>
              </div>

              {/* Back to cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/cart")}
                className="w-full mt-4 py-3 bg-transparent border-2 border-[#5C8374] text-[#5C8374] font-medium rounded-xl hover:bg-[#5C8374]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}