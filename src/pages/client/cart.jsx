import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ShoppingBag,
  ArrowRight,
  Package,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag,
  CreditCard,
  Truck,
  Shield,
  X
} from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await api.get("/users/cart");
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];
      setCart(cartData);
      toast.success("Cart loaded successfully! 🛒");
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
      toast.error("Failed to load cart 😞");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= UPDATE QTY ================= */
  const updateCartItem = async (productId, qtyChange) => {
    setUpdatingId(productId);
    const item = cart.find(item => item.productId === productId);
    const newQty = (item.qty || 1) + qtyChange;
    
    if (newQty < 1) {
      setUpdatingId(null);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        return { ...item, qty: newQty };
      }
      return item;
    });

    try {
      const res = await api.put("/users/cart", { cart: updatedCart });
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : updatedCart;
      setCart(cartData);
      toast.success(`Quantity updated to ${newQty}!`);
    } catch (err) {
      console.error("UPDATE CART ERROR:", err);
      toast.error("Failed to update quantity 😞");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    setRemovingId(productId);
    try {
      const res = await api.put("/users/cart", {
        cart: cart.filter((item) => item.productId !== productId),
      });
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];
      setCart(cartData);
      setSelectedIds((prev) => prev.filter((id) => id !== productId));
      toast.success("Item removed from cart 💔");
    } catch (err) {
      console.error("REMOVE ITEM ERROR:", err);
      toast.error("Failed to remove item 😞");
    } finally {
      setRemovingId(null);
    }
  };

  /* ================= SELECTION ================= */
  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isAllSelected = cart.length > 0 && selectedIds.length === cart.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      toast.success("All items unselected");
    } else {
      setSelectedIds(cart.map((item) => item.productId));
      toast.success("All items selected");
    }
  };

  const selectedItems = cart.filter((item) =>
    selectedIds.includes(item.productId)
  );

  /* ================= TOTALS ================= */
  const itemTotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      Number(item.labelledPrice || item.price || 0) *
        Number(item.qty || 1),
    0
  );
  const finalTotal = selectedItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );
  const discount = itemTotal - finalTotal;
  const savingsPercentage = itemTotal > 0 ? ((discount / itemTotal) * 100).toFixed(1) : 0;
  const canCheckout = selectedItems.length > 0;

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!canCheckout) {
      toast.error("Please select items to checkout");
      return;
    }
    navigate("/checkout", { state: { cart: selectedItems } });
  };

  /* ================= RENDER ================= */
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
          
          {[...Array(8)].map((_, i) => (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto text-center pt-20"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center border border-[#5C8374]/20 backdrop-blur-sm">
            <ShoppingCart className="w-16 h-16 text-[#5C8374]" />
          </div>
          <h1 className="text-4xl font-bold text-[#E3FEF7] mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-[#E3FEF7]/70 mb-8 max-w-2xl mx-auto">
            Start adding amazing anime art to your cart! Discover beautiful artworks waiting for you. 🎨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-xl hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore Artworks
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/wishlist")}
              className="px-8 py-4 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-xl hover:bg-[#77B0AA]/10 transition-all duration-300 flex items-center gap-3 justify-center"
            >
              View Wishlist
            </motion.button>
          </div>
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
            <ShoppingCart className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">My Cart</h1>
            <p className="text-[#E3FEF7]/70">{cart.length} item{cart.length !== 1 ? 's' : ''} • {selectedItems.length} selected</p>
          </div>
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items - Left Column */}
          <div className="flex-1">
            {/* Select All */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      isAllSelected
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] border-transparent"
                        : "bg-white border-[#5C8374]/30 group-hover:border-[#77B0AA]"
                    }`}>
                      {isAllSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`font-medium ${
                      isAllSelected ? "text-[#092635]" : "text-[#5C8374]"
                    }`}>
                      {isAllSelected ? "All Selected" : "Select All Items"}
                    </span>
                  </button>
                  <div className="text-right">
                    <div className="text-sm text-[#5C8374]">Selected</div>
                    <div className="text-lg font-bold text-[#092635]">
                      {selectedItems.length} of {cart.length}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const labelledPrice = Number(item.labelledPrice) || 0;
                  const qty = Number(item.qty) || 1;
                  const isSelected = selectedIds.includes(item.productId);
                  const hasDiscount = labelledPrice > price;

                  return (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? "border-[#5C8374] shadow-lg shadow-[#5C8374]/20"
                          : "border-white/40"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex gap-4">
                          {/* Selection checkbox */}
                          <button
                            onClick={() => toggleSelect(item.productId)}
                            className="flex-shrink-0"
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] border-transparent"
                                : "bg-white border-[#5C8374]/30 hover:border-[#77B0AA]"
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          </button>

                          {/* Product image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 rounded-xl object-cover border border-[#5C8374]/20 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => navigate(`/overview/${item.productId}`)}
                            />
                          </div>

                          {/* Product info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 
                                  className="font-bold text-[#092635] text-lg mb-1 truncate cursor-pointer hover:text-[#5C8374] transition-colors"
                                  onClick={() => navigate(`/overview/${item.productId}`)}
                                >
                                  {item.name}
                                </h3>
                                {hasDiscount && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-[#FF4081]/10 text-[#FF4081] text-xs font-bold rounded-full flex items-center gap-1">
                                      <Tag className="w-3 h-3" />
                                      {(((labelledPrice - price) / labelledPrice) * 100).toFixed(0)}% OFF
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-[#092635]">
                                  Rs. {(price * qty).toFixed(2)}
                                </div>
                                {hasDiscount && (
                                  <div className="text-sm text-[#5C8374] line-through">
                                    Rs. {(labelledPrice * qty).toFixed(2)}
                                  </div>
                                )}
                                <div className="text-xs text-[#5C8374]">
                                  Rs. {price.toFixed(2)} × {qty}
                                </div>
                              </div>
                            </div>

                            {/* Quantity controls and remove */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-[#5C8374]/20 rounded-lg px-3 py-1">
                                  <button
                                    disabled={qty <= 1 || updatingId === item.productId}
                                    onClick={() => updateCartItem(item.productId, -1)}
                                    className="p-1 text-[#5C8374] hover:text-[#77B0AA] disabled:text-[#5C8374]/30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {updatingId === item.productId ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Minus className="w-4 h-4" />
                                    )}
                                  </button>
                                  <span className="font-bold text-[#092635] min-w-[20px] text-center">
                                    {qty}
                                  </span>
                                  <button
                                    disabled={updatingId === item.productId}
                                    onClick={() => updateCartItem(item.productId, 1)}
                                    className="p-1 text-[#5C8374] hover:text-[#77B0AA] disabled:text-[#5C8374]/30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {updatingId === item.productId ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Plus className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.productId)}
                                disabled={removingId === item.productId}
                                className="px-4 py-2 bg-[#F44336]/10 text-[#F44336] font-medium rounded-lg hover:bg-[#F44336]/20 disabled:opacity-50 transition-all duration-300 flex items-center gap-2"
                              >
                                {removingId === item.productId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Remove
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary - Right Column */}
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
                    <ShoppingCart className="w-6 h-6 text-[#5C8374]" />
                    Order Summary
                  </h2>
                  <p className="text-[#5C8374] text-sm mt-1">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Item Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#5C8374]">Item Total</span>
                    <span className="text-lg font-semibold text-[#092635]">
                      Rs. {itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#5C8374] flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#4CAF50]" />
                        Discount
                      </span>
                      <span className="text-lg font-semibold text-[#4CAF50]">
                        - Rs. {discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Delivery */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#5C8374] flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Delivery
                    </span>
                    <span className="text-lg font-semibold text-[#092635]">
                      Free
                    </span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#5C8374]/20 to-transparent my-2"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#092635]">Total Amount</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#092635]">
                        Rs. {finalTotal.toFixed(2)}
                      </div>
                      {discount > 0 && (
                        <div className="text-sm text-[#4CAF50]">
                          You save Rs. {discount.toFixed(2)} ({savingsPercentage}%)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checkout button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={!canCheckout}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mt-6 flex items-center justify-center gap-3 ${
                      canCheckout
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] hover:shadow-xl hover:shadow-[#5C8374]/30"
                        : "bg-[#5C8374]/20 text-[#5C8374]/50 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  {/* Security info */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#5C8374]">
                    <Shield className="w-3 h-3" />
                    <span>Secure SSL Encryption • 100% Safe & Secure</span>
                  </div>
                </div>

                {/* Additional offers */}
                <div className="p-6 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <Tag className="w-5 h-5 text-[#FF9800]" />
                    <span className="font-bold text-[#092635]">Available Offers</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#5C8374]">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374] mt-1.5"></div>
                      <span>Free shipping on orders above Rs. 500</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374] mt-1.5"></div>
                      <span>Use code: ANIME10 for 10% extra discount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374] mt=1.5"></div>
                      <span>Earn loyalty points on every purchase</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Continue shopping */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full mt-4 py-3 bg-transparent border-2 border-[#5C8374] text-[#5C8374] font-medium rounded-xl hover:bg-[#5C8374]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}