import { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Package, 
  Eye,
  EyeOff,
  Filter,
  SortAsc,
  Sparkles,
  Edit2,
  Trash2,
  Loader2,
  User,
  ShoppingBag,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyReviews() {
  const { user } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, visible, hidden
  const [sortBy, setSortBy] = useState("date"); // date, rating
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [expandedOrder, setExpandedOrder] = useState({});

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    async function fetchReviews() {
      try {
        const res = await api.get("/reviews/my");
        setReviews(Array.isArray(res.data) ? res.data : []);
        toast.success("Reviews loaded successfully! ✨");
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        toast.error("Failed to load reviews 😞");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [user]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      if (filter === "visible") return !review.hidden;
      if (filter === "hidden") return review.hidden;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      } else {
        return sortOrder === "desc" 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  // Group reviews by orderId
  const reviewsByOrder = filteredReviews.reduce((acc, review) => {
    if (!acc[review.orderId]) acc[review.orderId] = [];
    acc[review.orderId].push(review);
    return acc;
  }, {});

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success("Review deleted successfully! 🗑️");
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error("Failed to delete review 😞");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 flex items-center justify-center border border-[#5C8374]/30">
            <MessageSquare className="w-12 h-12 text-[#5C8374]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E3FEF7] mb-3">Login to See Your Reviews</h2>
          <p className="text-[#E3FEF7]/60 mb-6 max-w-md mx-auto">
            Sign in to view and manage your product reviews!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/login"}
            className="px-8 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (filteredReviews.length === 0) {
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
            <MessageSquare className="w-16 h-16 text-[#5C8374]" />
          </div>
          <h1 className="text-4xl font-bold text-[#E3FEF7] mb-4">No Reviews Yet</h1>
          <p className="text-xl text-[#E3FEF7]/70 mb-8 max-w-2xl mx-auto">
            {filter === "all" 
              ? "You haven't written any reviews yet. Share your thoughts on purchased items! ✨"
              : filter === "visible"
              ? "No visible reviews found. Your reviews might be pending approval or hidden."
              : "No hidden reviews found."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/orders"}
            className="px-8 py-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-xl hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
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
        
        {[...Array(10)].map((_, i) => (
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#FF9800] to-[#FFB74D] flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">My Reviews</h1>
            <p className="text-[#E3FEF7]/70">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} across {Object.keys(reviewsByOrder).length} order{Object.keys(reviewsByOrder).length !== 1 ? 's' : ''}
            </p>
          </div>
          <Sparkles className="ml-auto text-[#FF9800] w-6 h-6" />
        </motion.div>

        {/* Stats and filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Review stats */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/20 rounded-xl">
                <div className="text-sm text-[#E3FEF7]/60">Total Reviews</div>
                <div className="text-xl font-bold text-[#E3FEF7]">{reviews.length}</div>
              </div>
              <div className="px-4 py-2 bg-[#092635]/30 backdrop-blur-sm border border-[#4CAF50]/20 rounded-xl">
                <div className="text-sm text-[#E3FEF7]/60">Visible</div>
                <div className="text-xl font-bold text-[#E3FEF7]">
                  {reviews.filter(r => !r.hidden).length}
                </div>
              </div>
              <div className="px-4 py-2 bg-[#092635]/30 backdrop-blur-sm border border-[#F44336]/20 rounded-xl">
                <div className="text-sm text-[#E3FEF7]/60">Hidden</div>
                <div className="text-xl font-bold text-[#E3FEF7]">
                  {reviews.filter(r => r.hidden).length}
                </div>
              </div>
              <div className="px-4 py-2 bg-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/20 rounded-xl">
                <div className="text-sm text-[#E3FEF7]/60">Avg Rating</div>
                <div className="text-xl font-bold text-[#E3FEF7] flex items-center gap-1">
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#5C8374]" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] focus:outline-none focus:ring-2 focus:ring-[#77B0AA]"
                >
                  <option value="all">All Reviews</option>
                  <option value="visible">Visible Only</option>
                  <option value="hidden">Hidden Only</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-[#5C8374]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] focus:outline-none focus:ring-2 focus:ring-[#77B0AA]"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-2 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] hover:bg-[#092635]/80 transition-colors"
                >
                  {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews by order */}
        <div className="space-y-6">
          <AnimatePresence>
            {Object.keys(reviewsByOrder).map((orderId, index) => (
              <motion.div
                key={orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
              >
                {/* Order header */}
                <button
                  onClick={() => toggleOrderExpansion(orderId)}
                  className="w-full p-6 text-left bg-gradient-to-r from-[#E3FEF7]/50 to-white/50 hover:from-[#E3FEF7]/70 hover:to-white/70 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#5C8374]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#092635]">Order #{orderId}</h3>
                        <div className="flex items-center gap-3 text-sm text-[#5C8374] mt-1">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{reviewsByOrder[orderId].length} review{reviewsByOrder[orderId].length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(reviewsByOrder[orderId][0].createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-[#5C8374]">Avg Rating</div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (reviewsByOrder[orderId].reduce((acc, r) => acc + r.rating, 0) / reviewsByOrder[orderId].length)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-[#5C8374]/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {expandedOrder[orderId] ? (
                        <ChevronUp className="w-5 h-5 text-[#5C8374]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#5C8374]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Review items (collapsible) */}
                <AnimatePresence>
                  {expandedOrder[orderId] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[#5C8374]/10"
                    >
                      <div className="p-6 space-y-4">
                        {reviewsByOrder[orderId].map((review) => (
                          <motion.div
                            key={review._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-5 rounded-xl backdrop-blur-sm border ${
                              review.hidden
                                ? "bg-gradient-to-r from-[#F44336]/5 to-[#F44336]/10 border-[#F44336]/20"
                                : "bg-gradient-to-r from-white/60 to-white/80 border-[#5C8374]/10"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-bold text-[#092635] text-lg mb-1">
                                      {review.productName || `Product ${review.productId}`}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-[#5C8374]">
                                      <Calendar className="w-3 h-3" />
                                      <span>
                                        Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {review.hidden ? (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#F44336]/10 text-[#F44336] rounded-full border border-[#F44336]/20">
                                      <EyeOff className="w-3 h-3" />
                                      <span className="text-xs font-medium">Hidden</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full border border-[#4CAF50]/20">
                                      <Eye className="w-3 h-3" />
                                      <span className="text-xs font-medium">Visible</span>
                                    </div>
                                  )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-5 h-5 ${
                                          star <= review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-[#5C8374]/30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-lg font-bold text-[#092635]">
                                    {review.rating}/5
                                  </span>
                                </div>

                                {/* Comment */}
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 text-sm text-[#5C8374] mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="font-medium">Your Comment</span>
                                  </div>
                                  <p className={`p-3 rounded-lg ${
                                    review.hidden 
                                      ? "bg-white/50 text-[#092635]/70" 
                                      : "bg-[#5C8374]/5 text-[#092635]"
                                  }`}>
                                    {review.comment}
                                  </p>
                                </div>

                                {/* Admin response */}
                                {review.adminReply && (
                                  <div className="mt-4 pt-4 border-t border-[#5C8374]/10">
                                    <div className="flex items-center gap-2 text-sm text-[#5C8374] mb-2">
                                      <User className="w-4 h-4" />
                                      <span className="font-medium">Admin Response</span>
                                    </div>
                                    <div className="p-3 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 rounded-lg border border-[#5C8374]/10">
                                      <p className="text-[#092635]">{review.adminReply}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                                  onClick={() => {
                                    // Edit review functionality
                                    toast.success("Edit feature coming soon! ✏️");
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </motion.button>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-[#F44336]/10 text-[#F44336] text-sm font-medium rounded-lg hover:bg-[#F44336]/20 transition-all duration-300 flex items-center gap-2"
                                  onClick={() => handleDeleteReview(review._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-transparent border border-[#5C8374] text-[#5C8374] text-sm font-medium rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 flex items-center gap-2"
                                  onClick={() => {
                                    // View product functionality
                                    window.location.href = `/overview/${review.productId}`;
                                  }}
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  View Product
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[#5C8374]/20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#1B4242]/40 to-[#092635]/40 backdrop-blur-sm border border-[#5C8374]/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-[#E3FEF7] mb-2">Review Summary</h3>
                  <p className="text-[#E3FEF7]/60">
                    You've shared your thoughts on {filteredReviews.length} product{filteredReviews.length !== 1 ? 's' : ''}. 
                    Keep helping others make informed decisions! ✨
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = "/myorders"}
                    className="px-6 py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-lg hover:bg-[#77B0AA]/10 transition-all duration-300"
                  >
                    Write More Reviews
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Back to Top
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}