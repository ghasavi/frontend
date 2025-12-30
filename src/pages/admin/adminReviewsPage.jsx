import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  Trash2,
  User,
  Package,
  Calendar,
  Mail,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Shield
} from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loadingReviewId, setLoadingReviewId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const RATING_OPTIONS = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "★★★★★ 5 Stars" },
    { value: "4", label: "★★★★☆ 4 Stars" },
    { value: "3", label: "★★★☆☆ 3 Stars" },
    { value: "2", label: "★★☆☆☆ 2 Stars" },
    { value: "1", label: "★☆☆☆☆ 1 Star" }
  ];

  const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "visible", label: "Visible Only", icon: Eye },
    { value: "hidden", label: "Hidden Only", icon: EyeOff }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reviews");
      const reviewsData = Array.isArray(res.data) ? res.data : [];
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      toast.success(`Loaded ${reviewsData.length} reviews successfully! 📝`);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      if (err.response?.status === 403) {
        toast.error("You are not authorized to view this page 🚫");
      } else {
        toast.error("Failed to fetch reviews 😞");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(review =>
        review.productName?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query) ||
        review.user?.email?.toLowerCase().includes(query) ||
        review.user?.username?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus === "visible") {
      result = result.filter(review => !review.hidden);
    } else if (filterStatus === "hidden") {
      result = result.filter(review => review.hidden);
    }

    // Apply rating filter
    if (filterRating !== "all") {
      result = result.filter(review => review.rating === parseInt(filterRating));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "rating") {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      } else if (sortBy === "product") {
        return sortOrder === "desc" 
          ? (b.productName || "").localeCompare(a.productName || "")
          : (a.productName || "").localeCompare(b.productName || "");
      }
      return 0;
    });

    setFilteredReviews(result);
  }, [reviews, searchQuery, filterStatus, filterRating, sortBy, sortOrder]);

  const toggleHide = async (id) => {
    setLoadingReviewId(id);
    try {
      const res = await api.put(`/reviews/${id}/hide`);
      setReviews(prev =>
        prev.map(review => review._id === id ? res.data : review)
      );
      toast.success(res.data.hidden ? "Review hidden successfully 👁️" : "Review unhidden successfully 👁️");
    } catch (err) {
      console.error("Failed to toggle hide:", err);
      toast.error("Failed to update review 😞");
    } finally {
      setLoadingReviewId(null);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    
    setLoadingReviewId(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(review => review._id !== id));
      toast.success("Review deleted successfully 🗑️");
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error("Failed to delete review 😞");
    } finally {
      setLoadingReviewId(null);
    }
  };

  const toggleRowExpand = (reviewId) => {
    setExpandedRows(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Statistics
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter(r => !r.hidden).length;
  const hiddenReviews = reviews.filter(r => r.hidden).length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading reviews...</p>
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Reviews Management</h1>
            <p className="text-[#E3FEF7]/70">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} • Avg. {avgRating}/5
            </p>
          </div>
          <Sparkles className="ml-auto text-[#FF9800] w-6 h-6" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Reviews", value: totalReviews, icon: MessageSquare, color: "from-[#5C8374] to-[#77B0AA]" },
            { label: "Visible Reviews", value: visibleReviews, icon: Eye, color: "from-[#4CAF50] to-[#81C784]" },
            { label: "Hidden Reviews", value: hiddenReviews, icon: EyeOff, color: "from-[#F44336] to-[#EF9A9A]" },
            { label: "Average Rating", value: `${avgRating}/5`, icon: Star, color: "from-[#FF9800] to-[#FFB74D]" }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#5C8374]">{stat.label}</div>
                  <div className="text-2xl font-bold text-[#092635]">{stat.value}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5C8374]" />
                <input
                  type="text"
                  placeholder="Search reviews by product, comment, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  {RATING_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="product">Sort by Product</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] hover:bg-white transition-colors"
                >
                  {sortOrder === "desc" ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchReviews}
                className="px-4 py-2.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
        >
          {/* Table header */}
          <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#092635]">Customer Reviews</h2>
              <div className="text-sm text-[#5C8374]">
                Showing {filteredReviews.length} of {totalReviews} reviews
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="divide-y divide-[#5C8374]/10">
            <AnimatePresence>
              {filteredReviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <MessageSquare className="w-16 h-16 text-[#5C8374]/30 mx-auto mb-4" />
                  <p className="text-[#5C8374] text-lg mb-2">No reviews found</p>
                  <p className="text-[#5C8374]/60 text-sm">
                    {searchQuery || filterStatus !== "all" || filterRating !== "all"
                      ? "Try adjusting your search or filters"
                      : "No reviews have been submitted yet"}
                  </p>
                </motion.div>
              ) : (
                filteredReviews.map((review, index) => {
                  const isExpanded = expandedRows[review._id];
                  
                  return (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${review.hidden ? 'bg-gradient-to-r from-[#F44336]/5 to-transparent' : ''} ${isExpanded ? 'bg-gradient-to-r from-[#5C8374]/5 to-transparent' : ''}`}
                    >
                      {/* Review summary row */}
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            {/* Rating */}
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                review.hidden 
                                  ? 'bg-gradient-to-r from-[#F44336]/20 to-[#EF9A9A]/20' 
                                  : 'bg-gradient-to-r from-[#FF9800]/20 to-[#FFB74D]/20'
                              }`}>
                                <div className="text-center">
                                  <div className="text-xl font-bold text-[#092635]">{review.rating}</div>
                                  <Star className="w-3 h-3 text-[#FF9800] mx-auto" />
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#092635] truncate">
                                  {review.productName || `Product ${review.productId}`}
                                </h3>
                                {review.hidden && (
                                  <span className="px-2 py-0.5 bg-[#F44336]/10 text-[#F44336] text-xs font-bold rounded-full flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    Hidden
                                  </span>
                                )}
                              </div>
                              
                              {/* Comment preview */}
                              <p className="text-[#5C8374] text-sm line-clamp-2 mb-2">
                                {review.comment}
                              </p>
                              
                              {/* User info */}
                              <div className="flex items-center gap-4 text-xs text-[#5C8374]">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{review.user?.username || 'Unknown User'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Stars */}
                          <div className="hidden md:flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-[#5C8374]/20"
                                }`}
                              />
                            ))}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRowExpand(review._id)}
                            className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleHide(review._id)}
                            disabled={loadingReviewId === review._id}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                              review.hidden
                                ? "bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20"
                                : "bg-[#F44336]/10 text-[#F44336] hover:bg-[#F44336]/20"
                            }`}
                          >
                            {loadingReviewId === review._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : review.hidden ? (
                              <>
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Unhide</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span className="hidden sm:inline">Hide</span>
                              </>
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteReview(review._id)}
                            disabled={loadingReviewId === review._id}
                            className="p-2 bg-[#F44336]/10 text-[#F44336] rounded-lg hover:bg-[#F44336]/20 disabled:opacity-50 transition-colors"
                          >
                            {loadingReviewId === review._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="p-4 bg-gradient-to-r from-[#5C8374]/5 to-transparent rounded-xl border border-[#5C8374]/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Review details */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-bold text-[#092635] mb-2 flex items-center gap-2">
                                      <Package className="w-4 h-4 text-[#5C8374]" />
                                      Product Information
                                    </h4>
                                    <div className="text-[#092635]">{review.productName || `Product ${review.productId}`}</div>
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-[#092635] mb-2 flex items-center gap-2">
                                      <MessageSquare className="w-4 h-4 text-[#5C8374]" />
                                      Review Comment
                                    </h4>
                                    <div className="p-3 bg-white/50 rounded-lg border border-[#5C8374]/10 text-[#092635]">
                                      {review.comment}
                                    </div>
                                  </div>
                                </div>

                                {/* User and order details */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-bold text-[#092635] mb-2 flex items-center gap-2">
                                      <User className="w-4 h-4 text-[#5C8374]" />
                                      User Information
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#5C8374]" />
                                        <span className="text-[#092635]">{review.user?.username || 'Unknown User'}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#5C8374]" />
                                        <span className="text-[#092635]">{review.user?.email || 'No email'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-[#092635] mb-2 flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-[#5C8374]" />
                                      Order Information
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="text-[#092635]">
                                        Order ID: <span className="font-mono">{review.orderId}</span>
                                      </div>
                                      <div className="text-[#092635]">
                                        Date: {new Date(review.createdAt).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Admin reply (if exists) */}
                              {review.adminReply && (
                                <div className="mt-4 pt-4 border-t border-[#5C8374]/10">
                                  <h4 className="font-bold text-[#092635] mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-[#5C8374]" />
                                    Admin Response
                                  </h4>
                                  <div className="p-3 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded-lg border border-[#5C8374]/20 text-[#092635]">
                                    {review.adminReply}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Table footer */}
          <div className="p-4 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
            <div className="flex items-center justify-between text-sm text-[#5C8374]">
              <div>
                Showing {filteredReviews.length} of {totalReviews} reviews
              </div>
              <div className="flex items-center gap-4">
                <span>Average Rating: <span className="font-bold text-[#092635]">{avgRating}/5</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}