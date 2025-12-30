import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Trash2, 
  Eye, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  HeartOff,
  Loader2,
  ChevronRight,
  Star,
  Palette
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyWishlistPage() {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const wishlistKey = user?.email ? `wishlist_${user.email}` : null;

  useEffect(() => {
    if (!wishlistKey) {
      setLoading(false);
      return;
    }
    
    // Simulate loading for smooth transition
    setTimeout(() => {
      const userWishlist = getWishlist(wishlistKey);
      setWishlist(userWishlist);
      setLoading(false);
    }, 500);
  }, [wishlistKey]);

  function handleRemove(productId) {
    if (!wishlistKey) return;
    
    setRemovingId(productId);
    setTimeout(() => {
      removeFromWishlist(productId, wishlistKey);
      const updatedWishlist = getWishlist(wishlistKey);
      setWishlist(updatedWishlist);
      setRemovingId(null);
      toast.success("Removed from wishlist 💔");
    }, 300);
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
            <Heart className="w-12 h-12 text-[#5C8374]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E3FEF7] mb-3">Login to See Your Wishlist</h2>
          <p className="text-[#E3FEF7]/60 mb-6 max-w-md mx-auto">
            Sign in to view and manage your favorite anime art pieces!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowRight className="w-5 h-5" />
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
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
            <HeartOff className="w-16 h-16 text-[#5C8374]" />
          </div>
          <h1 className="text-4xl font-bold text-[#E3FEF7] mb-4">Your Wishlist is Empty</h1>
          <p className="text-xl text-[#E3FEF7]/70 mb-8 max-w-2xl mx-auto">
            Start exploring amazing anime art and add your favorites here! ❤️
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-xl hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore Artworks
            <ArrowRight className="w-5 h-5" />
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#FF4081] to-[#F50057] flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">My Wishlist</h1>
            <p className="text-[#E3FEF7]/70">{wishlist.length} favorite item{wishlist.length !== 1 ? 's' : ''}</p>
          </div>
          <Sparkles className="ml-auto text-[#FF4081] w-6 h-6" />
        </motion.div>

        {/* Wishlist counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/20 rounded-full">
            <Heart className="w-4 h-4 text-[#FF4081]" />
            <span className="text-[#E3FEF7] text-sm">
              <span className="font-bold">{wishlist.length}</span> item{wishlist.length !== 1 ? 's' : ''} in wishlist
            </span>
          </div>
        </motion.div>

        {/* Wishlist grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 shadow-xl shadow-[#003C43]/10 hover:shadow-2xl hover:shadow-[#003C43]/20 transition-all duration-300">
                  {/* Heart badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF4081] to-[#F50057] flex items-center justify-center shadow-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Product image */}
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-[#5C8374]/10 to-[#77B0AA]/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => navigate(`/overview/${item.productId}`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product info */}
                  <div className="p-5">
                    <h3 
                      className="text-lg font-bold text-[#092635] mb-2 truncate cursor-pointer hover:text-[#5C8374] transition-colors"
                      onClick={() => navigate(`/overview/${item.productId}`)}
                    >
                      {item.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (item.rating || 4)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-[#5C8374]/20"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-[#5C8374] ml-2">
                        ({item.reviews || 12})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-[#092635]">
                          Rs. {Number(item.price).toFixed(2)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-sm text-[#5C8374] line-through">
                            Rs. {Number(item.originalPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                      {item.discount && (
                        <div className="px-2 py-1 bg-[#FF4081]/10 text-[#FF4081] text-xs font-bold rounded-full">
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/overview/${item.productId}`)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-medium rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(item.productId)}
                        disabled={removingId === item.productId}
                        className="px-4 py-2.5 bg-[#F44336]/10 text-[#F44336] font-medium rounded-lg hover:bg-[#F44336]/20 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                      >
                        {removingId === item.productId ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* Quick add to cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 py-2 bg-transparent border border-[#5C8374] text-[#5C8374] font-medium rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => {
                        // Add to cart functionality
                        toast.success("Added to cart! 🛒");
                      }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                  </div>

                  {/* Artist info */}
                  <div className="px-5 py-3 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
                    <div className="flex items-center gap-2 text-sm">
                      <Palette className="w-3 h-3 text-[#5C8374]" />
                      <span className="text-[#5C8374]">By </span>
                      <span className="font-medium text-[#092635]">
                        {item.artist || "Anime Artist"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Wishlist summary */}
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
                  <h3 className="text-xl font-bold text-[#E3FEF7] mb-2">Wishlist Summary</h3>
                  <p className="text-[#E3FEF7]/60">
                    {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} • Total value:{" "}
                    <span className="font-bold text-[#E3FEF7]">
                      Rs. {wishlist.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-lg hover:bg-[#77B0AA]/10 transition-all duration-300"
                  >
                    Continue Shopping
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                    onClick={() => {
                      // Add all to cart functionality
                      toast.success("All items added to cart! 🛒");
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add All to Cart
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