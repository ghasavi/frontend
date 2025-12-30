import { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Star, 
  Edit2, 
  ChevronRight,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  X,
  Loader2,
  CreditCard,
  Truck,
  Download,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = [
  { value: "all", label: "All Orders", icon: Package, color: "from-[#5C8374] to-[#77B0AA]" },
  { value: "pending", label: "Pending", icon: Clock, color: "from-[#FFB74D] to-[#FF9800]" },
  { value: "completed", label: "Completed", icon: CheckCircle, color: "from-[#4CAF50] to-[#2E7D32]" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "from-[#F44336] to-[#C62828]" },
  { value: "returned", label: "Returned", icon: RefreshCw, color: "from-[#9C27B0] to-[#6A1B9A]" }
];

export default function MyOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Review state
  const [reviewingItem, setReviewingItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    async function fetchData() {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/reviews/my"),
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setMyReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        toast.success("Orders loaded successfully! 🎨");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load orders 😞");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  function hasReviewed(productId) {
    return myReviews.some((r) => r.productId === productId);
  }

  async function submitReview() {
    if (rating < 1 || rating > 5 || !comment.trim()) {
      toast.error("Please select a rating (1-5) and add a comment ✏️");
      return;
    }
    if (!reviewingItem) return;

    try {
      const res = await api.post("/reviews", {
        productId: reviewingItem.productId,
        orderId: reviewingItem.orderId,
        rating,
        comment,
      });

      setMyReviews((prev) => [...prev, res.data]);
      toast.success("Review submitted successfully! 🔥");
      setReviewingItem(null);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review 😞");
    }
  }

  const filteredOrders = orders
    .filter(order => 
      selectedStatus === "all" ? true : order.status === selectedStatus
    )
    .filter(order =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(item => 
        item.productInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4 md:p-6">
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
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#E3FEF7]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#E3FEF7]">My Orders</h1>
              <p className="text-[#E3FEF7]/70">Track and manage your art purchases</p>
            </div>
          </motion.div>
          
          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md mt-6"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5C8374]" />
            <input
              type="text"
              placeholder="Search orders or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl text-[#092635] placeholder:text-[#5C8374]/60 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
            />
          </motion.div>
        </div>

        {/* Status filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {STATUSES.map((status) => {
            const Icon = status.icon;
            return (
              <motion.button
                key={status.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-6 py-3 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                  selectedStatus === status.value
                    ? `bg-gradient-to-r ${status.color} border-transparent text-white shadow-lg`
                    : "bg-white/90 backdrop-blur-sm border-[#5C8374]/20 text-[#092635] hover:border-[#77B0AA] hover:shadow-md"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{status.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedStatus === status.value
                    ? "bg-white/20 text-white"
                    : "bg-[#5C8374]/10 text-[#5C8374]"
                }`}>
                  {status.value === "all" 
                    ? orders.length 
                    : orders.filter(o => o.status === status.value).length}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Orders grid */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Package className="w-12 h-12 text-[#5C8374]" />
            </div>
            <h3 className="text-xl font-semibold text-[#E3FEF7] mb-2">No orders found</h3>
            <p className="text-[#E3FEF7]/60 max-w-md mx-auto">
              {searchQuery 
                ? "No orders match your search. Try a different keyword."
                : "You haven't placed any orders yet. Start exploring amazing anime art!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
              >
                {/* Order header - Lighter version */}
                <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#E3FEF7]/50 to-white/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 border border-[#5C8374]/20">
                          <span className="text-sm font-mono text-[#092635] font-medium">
                            #{order.orderId}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          order.status === "pending" 
                            ? "bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/30"
                            : order.status === "completed"
                            ? "bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/30"
                            : order.status === "cancelled"
                            ? "bg-[#F44336]/10 text-[#F44336] border border-[#F44336]/30"
                            : "bg-[#9C27B0]/10 text-[#9C27B0] border border-[#9C27B0]/30"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#5C8374]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{order.products.length} item{order.products.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Paid</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#092635]">Rs. {order.total}</div>
                      <div className="text-sm text-[#5C8374]">Total Amount</div>
                    </div>
                  </div>
                </div>

                {/* Customer info - Lighter */}
                <div className="p-6 border-b border-[#5C8374]/10 bg-white/30">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#092635] mb-4">
                    <User className="w-5 h-5 text-[#5C8374]" />
                    Delivery Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] mb-1">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Name</span>
                      </div>
                      <div className="text-[#092635] font-medium">{order.name}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] mb-1">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Phone</span>
                      </div>
                      <div className="text-[#092635] font-medium">{order.phone}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Address</span>
                      </div>
                      <div className="text-[#092635] font-medium">{order.address}</div>
                    </div>
                  </div>
                </div>

                {/* Products section - Lighter */}
                <div className="p-6 bg-gradient-to-br from-white/40 to-white/60">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#092635] mb-4">
                    <ShoppingBag className="w-5 h-5 text-[#5C8374]" />
                    Ordered Items
                  </h3>
                  <div className="space-y-4">
                    {order.products.map((item, idx) => {
                      const reviewed = hasReviewed(item.productInfo.productId);
                      const image = item.productInfo.images?.[0];
                      const itemTotal = item.productInfo.price * item.quantity;
                      
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-[#5C8374]/10 shadow-sm"
                        >
                          {image && (
                            <div className="flex-shrink-0">
                              <img
                                src={image}
                                alt={item.productInfo.name}
                                className="w-20 h-20 rounded-lg object-cover border border-[#5C8374]/20 shadow-sm"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#092635] truncate">
                              {item.productInfo.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                              <span className="px-2 py-1 bg-[#5C8374]/10 text-[#5C8374] rounded-full text-xs">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-[#5C8374]">
                                Rs. {item.productInfo.price} each
                              </span>
                            </div>
                            {order.status === "completed" && (
                              <div className="mt-3">
                                <span className="text-sm font-medium text-[#4CAF50] flex items-center gap-1">
                                  <Truck className="w-4 h-4" />
                                  Delivered on {new Date(order.date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#092635]">
                                Rs. {itemTotal}
                              </div>
                              <div className="text-xs text-[#5C8374]">
                                {item.quantity} × Rs. {item.productInfo.price}
                              </div>
                            </div>
                            {order.status === "completed" && (
                              <div className="flex gap-2">
                                {!reviewed ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      setReviewingItem({
                                        orderId: order.orderId,
                                        productId: item.productInfo.productId,
                                        productName: item.productInfo.name,
                                        productImage: item.productInfo.images?.[0],
                                      })
                                    }
                                    className="px-4 py-2 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Review
                                  </motion.button>
                                ) : (
                                  <div className="px-3 py-2 bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-medium rounded-lg border border-[#4CAF50]/30 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Reviewed
                                  </div>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                                  onClick={() => {
                                    // View invoice/download functionality
                                    toast.success("Downloading invoice...");
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Order summary */}
                  <div className="mt-6 pt-6 border-t border-[#5C8374]/10">
                    <div className="flex justify-between items-center">
                      <div className="text-[#5C8374]">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Order Summary</span>
                        </div>
                        <div className="text-xs">
                          {order.products.length} item{order.products.length !== 1 ? 's' : ''} • Placed on {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#092635]">Rs. {order.total}</div>
                        <div className="text-sm text-[#5C8374]">
                          Including all taxes and shipping
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#092635]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setReviewingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-b from-white to-[#E3FEF7] border border-[#5C8374]/30 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#092635]">Write a Review</h3>
                      <p className="text-sm text-[#5C8374]">{reviewingItem.productName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReviewingItem(null)}
                    className="p-2 hover:bg-[#5C8374]/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#092635]" />
                  </button>
                </div>
                {reviewingItem.productImage && (
                  <img
                    src={reviewingItem.productImage}
                    alt={reviewingItem.productName}
                    className="w-20 h-20 rounded-lg object-cover mx-auto mb-4 border border-[#5C8374]/20"
                  />
                )}
              </div>

              {/* Rating stars */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-[#5C8374] mb-2">How would you rate this product?</p>
                </div>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className="text-4xl transition-all duration-300"
                    >
                      <Star
                        className={`${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-[#5C8374]/30"
                        } hover:text-yellow-300`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm text-[#5C8374] mb-2 font-medium">
                  {rating === 0
                    ? "Tap stars to rate"
                    : rating <= 2
                    ? "Needs improvement 😔"
                    : rating <= 3
                    ? "Good ✨"
                    : rating <= 4
                    ? "Great! 😊"
                    : "Excellent! 🔥"}
                </p>

                {/* Review text */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product... What did you like or dislike?"
                  className="w-full h-32 px-4 py-3 bg-white/80 border border-[#5C8374]/20 rounded-xl text-[#092635] placeholder:text-[#5C8374]/40 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all resize-none mt-4"
                />

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReviewingItem(null)}
                    className="flex-1 py-3 bg-transparent border border-[#5C8374] text-[#5C8374] font-medium rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitReview}
                    disabled={!rating || !comment.trim()}
                    className={`flex-1 py-3 font-medium rounded-lg transition-all duration-300 ${
                      rating && comment.trim()
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white hover:shadow-lg hover:shadow-[#5C8374]/30"
                        : "bg-[#5C8374]/10 text-[#5C8374]/50 cursor-not-allowed"
                    }`}
                  >
                    Submit Review
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}