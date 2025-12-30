import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Shield,
  Sparkles,
  Check,
  Home,
  Building,
  Navigation,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.cart || []);

  /* ================= FORM STATE ================= */
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SHIPPING_FEE = 0; // Free shipping

  const PROVINCES = [
    { name: "Western", districts: ["Colombo", "Gampaha", "Kalutara"] },
    { name: "Central", districts: ["Kandy", "Matale", "Nuwara Eliya"] },
    { name: "Southern", districts: ["Galle", "Matara", "Hambantota"] },
    { name: "Northern", districts: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"] },
    { name: "Eastern", districts: ["Trincomalee", "Batticaloa", "Ampara"] },
    { name: "North Western", districts: ["Kurunegala", "Puttalam"] },
    { name: "North Central", districts: ["Anuradhapura", "Polonnaruwa"] },
    { name: "Uva", districts: ["Badulla", "Monaragala"] },
    { name: "Sabaragamuwa", districts: ["Ratnapura", "Kegalle"] },
  ];

  const districts = PROVINCES.find((p) => p.name === province)?.districts || [];

  /* ================= TOTALS ================= */
  const itemTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.labelledPrice || item.price || 0) * Number(item.qty || 1),
    0
  );
  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );
  const discount = itemTotal - subTotal;
  const savingsPercentage = itemTotal > 0 ? ((discount / itemTotal) * 100).toFixed(1) : 0;
  const orderTotal = subTotal + SHIPPING_FEE;

  /* ================= CART ACTIONS ================= */
  const changeQty = (index, delta) => {
    const newCart = [...cart];
    const newQty = newCart[index].qty + delta;
    if (newQty <= 0) {
      newCart.splice(index, 1);
      toast.success("Item removed from cart");
    } else {
      newCart[index].qty = newQty;
    }
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    toast.success("Item removed from cart");
  };

  /* ================= VALIDATION ================= */
  const errors = {
    name: !name.trim() ? "Full name is required" : "",
    province: !province ? "Province is required" : "",
    district: !district ? "District is required" : "",
    city: !city.trim() ? "City is required" : "",
    address: !address.trim() ? "Address is required" : "",
    phone: !/^07\d{8}$/.test(phone) ? "Enter a valid Sri Lankan phone number (07XXXXXXXX)" : "",
  };

  const hasErrors = Object.values(errors).some(error => error);
  const canPlaceOrder = cart.length > 0 && !hasErrors;

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    if (!canPlaceOrder) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    
    // Compose full address
    const fullAddress = `${village ? village + ", " : ""}${city}, ${district}, ${province}. ${address}`;

    // Simulate API call
    setTimeout(() => {
      toast.success("Order details saved! Proceeding to payment...");
      navigate("/payment", {
        state: {
          cart,
          name,
          phone,
          address: fullAddress,
          orderTotal,
          discount,
          subTotal,
        },
      });
      setIsSubmitting(false);
    }, 1000);
  };

  if (cart.length === 0) {
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
          <h2 className="text-2xl font-bold text-[#E3FEF7] mb-3">Your Cart is Empty</h2>
          <p className="text-[#E3FEF7]/60 mb-6 max-w-md mx-auto">
            Add items to your cart before proceeding to checkout.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cart")}
            className="px-8 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Cart
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, ${i % 3 === 0 ? '#5C8374' : i % 3 === 1 ? '#9EC8B9' : '#77B0AA'})`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Checkout</h1>
            <p className="text-[#E3FEF7]/70">Complete your order in 3 simple steps</p>
          </div>
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </motion.div>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto mb-4">
            {['Cart', 'Delivery', 'Payment'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white'
                    : index === 1
                    ? 'bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white'
                    : 'bg-white/20 text-[#E3FEF7]'
                }`}>
                  {index === 0 ? '1' : index === 1 ? '2' : '3'}
                </div>
                <span className={`text-sm font-medium ${
                  index === 1 ? 'text-[#E3FEF7]' : 'text-[#E3FEF7]/60'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5C8374] via-[#5C8374] to-[#5C8374]/20"></div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - Form and Items */}
          <div className="flex-1 space-y-6">
            {/* Delivery Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
            >
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#5C8374]" />
                  Delivery Details
                </h2>
                <p className="text-[#5C8374] text-sm mt-1">Enter your delivery information</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none transition-all ${
                      errors.name ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 mt-2 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                      <Navigation className="w-4 h-4" />
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => { setProvince(e.target.value); setDistrict(""); }}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] focus:outline-none transition-all ${
                        errors.province ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                      }`}
                    >
                      <option value="" className="text-[#5C8374]">Select Province</option>
                      {PROVINCES.map((p) => (
                        <option key={p.name} value={p.name} className="text-[#092635]">
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <div className="flex items-center gap-2 mt-2 text-[#F44336] text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.province}
                      </div>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                      <Building className="w-4 h-4" />
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!province}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.district ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                      }`}
                    >
                      <option value="" className="text-[#5C8374]">Select District</option>
                      {districts.map((d) => (
                        <option key={d} value={d} className="text-[#092635]">
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <div className="flex items-center gap-2 mt-2 text-[#F44336] text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.district}
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                      <Building className="w-4 h-4" />
                      City *
                    </label>
                    <input
                      placeholder="e.g., Colombo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none transition-all ${
                        errors.city ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                      }`}
                    />
                  </div>

                  {/* Village (Optional) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                      <Home className="w-4 h-4" />
                      Village (Optional)
                    </label>
                    <input
                      placeholder="e.g., Kotte"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-[#5C8374]/20 rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <MapPin className="w-4 h-4" />
                    Full Address *
                  </label>
                  <textarea
                    placeholder="House No, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none transition-all resize-none ${
                      errors.address ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                    }`}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-2 mt-2 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    placeholder="07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none transition-all ${
                      errors.phone ? 'border-[#F44336] focus:ring-2 focus:ring-[#F44336]' : 'border-[#5C8374]/20 focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent'
                    }`}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-2 mt-2 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Order Items Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
            >
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#5C8374]" />
                  Order Items ({cart.length})
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-[#5C8374]/10"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-[#5C8374]/20"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#092635] truncate">{item.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-lg font-bold text-[#092635]">
                          Rs. {item.price.toFixed(2)}
                        </span>
                        {item.labelledPrice > item.price && (
                          <span className="text-sm text-[#5C8374] line-through">
                            Rs. {item.labelledPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/80 border border-[#5C8374]/20 rounded-lg px-3 py-1">
                        <button
                          onClick={() => changeQty(index, -1)}
                          className="p-1 text-[#5C8374] hover:text-[#77B0AA] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-[#092635] min-w-[24px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => changeQty(index, 1)}
                          className="p-1 text-[#5C8374] hover:text-[#77B0AA] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-[#F44336] hover:bg-[#F44336]/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-2xl shadow-[#003C43]/10 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 border-b border-[#5C8374]/10">
                  <h2 className="text-2xl font-bold text-[#092635] flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-[#5C8374]" />
                    Order Summary
                  </h2>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5C8374]">Item Total</span>
                    <span className="text-lg font-semibold text-[#092635]">
                      Rs. {itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[#5C8374]">Discount</span>
                        <span className="text-lg font-semibold text-[#4CAF50]">
                          - Rs. {discount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-[#4CAF50]">
                        <span>You save</span>
                        <span>{savingsPercentage}%</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[#5C8374]">Subtotal</span>
                    <span className="text-lg font-semibold text-[#092635]">
                      Rs. {subTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#5C8374]">Shipping</span>
                    <span className="text-lg font-semibold text-[#092635]">
                      {SHIPPING_FEE === 0 ? 'FREE' : `Rs. ${SHIPPING_FEE.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#5C8374]/20 to-transparent my-4"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#092635]">Order Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#092635]">
                        Rs. {orderTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#5C8374]">Including all taxes</div>
                    </div>
                  </div>

                  {/* Security info */}
                  <div className="flex items-center gap-2 mt-4 p-3 bg-[#5C8374]/5 rounded-lg border border-[#5C8374]/10">
                    <Shield className="w-5 h-5 text-[#5C8374]" />
                    <div className="text-sm text-[#5C8374]">
                      <div className="font-medium">Secure Checkout</div>
                      <div>Your payment information is encrypted</div>
                    </div>
                  </div>

                  {/* Proceed button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeOrder}
                    disabled={!canPlaceOrder || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mt-6 flex items-center justify-center gap-3 ${
                      canPlaceOrder && !isSubmitting
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] hover:shadow-xl hover:shadow-[#5C8374]/30"
                        : "bg-[#5C8374]/20 text-[#5C8374]/50 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {/* Back to cart */}
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full mt-3 text-center text-[#5C8374] hover:text-[#77B0AA] transition-colors text-sm"
                  >
                    ← Back to cart
                  </button>
                </div>

                {/* Delivery estimate */}
                <div className="p-6 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-5 h-5 text-[#5C8374]" />
                    <span className="font-bold text-[#092635]">Delivery Estimate</span>
                  </div>
                  <div className="text-sm text-[#5C8374] space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374]"></div>
                      <span>Colombo, Gampaha, Kalutara: 1-2 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374]"></div>
                      <span>Other areas: 3-5 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}