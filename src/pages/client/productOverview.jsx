import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  Star, 
  Truck, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Palette,
  Brush,
  Ruler,
  Calendar,
  Tag,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import { UserContext } from "../../context/UserContext";
import { addToWishlist } from "../../utils/wishlist";

export default function ProductOverviewPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const wishlistKey = user?.email ? `wishlist_${user.email}` : null;

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const images = Array.isArray(product?.images) ? product.images : [];

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!productId) {
      setStatus("error");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error("Failed to load product 😞");
      }
    };

    fetchProduct();
  }, [productId]);

 useEffect(() => {
  if (!product) return;

  if (
    product.displayImage &&
    Array.isArray(product.images) &&
    !product.images.includes(product.displayImage)
  ) {
    setProduct((prev) => ({
      ...prev,
      images: [product.displayImage, ...prev.images],
    }));
  }
}, [product]);


  /* ================= FETCH RELATED ================= */
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get("/products");
        const list = Array.isArray(res.data) ? res.data : [];
        setRelatedProducts(
          list.filter((p) => p.productId !== productId).slice(0, 4)
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchRelated();
  }, [productId]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !product) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#F44336]/20 to-[#F44336]/10 flex items-center justify-center border border-[#F44336]/30">
            <AlertCircle className="w-12 h-12 text-[#F44336]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E3FEF7] mb-3">Product Not Found</h2>
          <p className="text-[#E3FEF7]/60 mb-6 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ================= SAFE VALUES ================= */
  const price = Number(product?.price) || 0;
  const labelledPrice = Number(product?.labelledPrice) || 0;
  const altNames = Array.isArray(product?.altNames) ? product.altNames : [];
  const stock = Number(product?.stock) || 0;
  const isOutOfStock = stock <= 0;
  const hasDiscount = labelledPrice > price;
  const discountPercentage = hasDiscount ? Math.round(((labelledPrice - price) / labelledPrice) * 100) : 0;

  /* ================= IMAGE SLIDER ================= */
  const nextImage = () => {
  if (!images.length) return;
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
};

const prevImage = () => {
  if (!images.length) return;
  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
};


  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart 😤");
      navigate("/login");
      return;
    }
    
    if (isOutOfStock) {
      toast.error("Out of stock 😭");
      return;
    }

    setAddingToCart(true);
    
    try {
      const res = await api.get("/users/cart");

      const currentCart = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];

      const index = currentCart.findIndex(
        (item) => item.productId === product.productId
      );

      let updatedCart;

      if (index === -1) {
        updatedCart = [
          ...currentCart,
          {
            productId: product.productId,
            name: product.name,
            image: product.displayImage || images[0] || "",
            price,
            labelledPrice,
            qty: quantity,
          },
        ];
      } else {
        updatedCart = currentCart.map((item, i) =>
          i === index ? { ...item, qty: item.qty + quantity } : item
        );
      }

      await api.put("/users/cart", { cart: updatedCart });

      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart! 🛒`);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      toast.error("Failed to add to cart 😭");
    } finally {
      setAddingToCart(false);
    }
  };

  /* ================= ADD TO WISHLIST ================= */
  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please login to add to wishlist ❤️");
      navigate("/login");
      return;
    }

    setAddingToWishlist(true);
    setTimeout(() => {
      const ok = addToWishlist(product, wishlistKey);
      if (ok) {
        toast.success("Added to wishlist! ❤️");
      } else {
        toast.error("Already in your wishlist 😏");
      }
      setAddingToWishlist(false);
    }, 500);
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to purchase 😤");
      navigate("/login");
      return;
    }
    
    if (isOutOfStock) {
      toast.error("Out of stock 😭");
      return;
    }

    navigate("/checkout", {
      state: {
        cart: [
          {
            productId: product.productId,
            name: product.name,
image: product.displayImage || images[0] || "",
            price,
            labelledPrice,
            qty: quantity,
          },
        ],
      },
    });
  };

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#E3FEF7]/70 hover:text-[#E3FEF7] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden">
              {/* Main image */}
              <div className="relative aspect-square bg-gradient-to-br from-[#5C8374]/10 to-[#77B0AA]/10">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                    
                    {/* Image navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-[#5C8374]/20 rounded-full flex items-center justify-center text-[#5C8374] hover:bg-white hover:shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-[#5C8374]/20 rounded-full flex items-center justify-center text-[#5C8374] hover:bg-white hover:shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Image counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-24 h-24 text-[#5C8374]/30" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 border-t border-[#5C8374]/10">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? "border-[#5C8374] shadow-md"
                            : "border-transparent hover:border-[#5C8374]/30"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 lg:max-w-lg"
          >
            <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden">
              {/* Product header */}
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#092635]">
                      {product.name}
                    </h1>
                    {altNames.length > 0 && (
                      <p className="text-[#5C8374] mt-1">
                        Also known as: {altNames.join(" • ")}
                      </p>
                    )}
                  </div>
                  <Sparkles className="w-6 h-6 text-[#FF9800] flex-shrink-0" />
                </div>
              </div>

              {/* Product info */}
              <div className="p-6 space-y-6">
               

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-[#092635] mb-2 flex items-center gap-2">
                    <Brush className="w-5 h-5 text-[#5C8374]" />
                    Description
                  </h3>
                  <p className="text-[#5C8374] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product details */}
                <div className="grid grid-cols-2 gap-4">
                  {product.size && (
                    <div className="p-3 bg-white/50 rounded-lg border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] text-sm mb-1">
                        <Ruler className="w-4 h-4" />
                        Size
                      </div>
                      <div className="font-medium text-[#092635]">{product.size}</div>
                    </div>
                  )}
                  
                  {product.medium && (
                    <div className="p-3 bg-white/50 rounded-lg border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] text-sm mb-1">
                        <Palette className="w-4 h-4" />
                        Medium
                      </div>
                      <div className="font-medium text-[#092635]">{product.medium}</div>
                    </div>
                  )}
                  
                  {product.material && (
                    <div className="p-3 bg-white/50 rounded-lg border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] text-sm mb-1">
                        <Package className="w-4 h-4" />
                        Material
                      </div>
                      <div className="font-medium text-[#092635]">{product.material}</div>
                    </div>
                  )}
                  
                  {product.year && (
                    <div className="p-3 bg-white/50 rounded-lg border border-[#5C8374]/10">
                      <div className="flex items-center gap-2 text-[#5C8374] text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        Year
                      </div>
                      <div className="font-medium text-[#092635]">{product.year}</div>
                    </div>
                  )}
                </div>

                {/* Stock status */}
                <div className={`p-4 rounded-lg border ${
                  isOutOfStock
                    ? "bg-[#F44336]/10 border-[#F44336]/20"
                    : "bg-[#4CAF50]/10 border-[#4CAF50]/20"
                }`}>
                  <div className="flex items-center gap-3">
                    {isOutOfStock ? (
                      <AlertCircle className="w-6 h-6 text-[#F44336]" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
                    )}
                    <div>
                      <div className="font-bold text-[#092635]">
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </div>
                      <div className="text-sm text-[#5C8374]">
                        {isOutOfStock 
                          ? "This item is currently unavailable" 
                          : `Only ${stock} item${stock !== 1 ? 's' : ''} left`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-[#5C8374]/10">
                  <div className="flex items-end gap-4">
                    <div>
                      <div className="text-4xl font-bold text-[#092635]">
                        Rs. {price.toFixed(2)}
                      </div>
                      {hasDiscount && (
                        <>
                          <div className="text-lg text-[#5C8374] line-through">
                            Rs. {labelledPrice.toFixed(2)}
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF4081]/10 text-[#FF4081] text-sm font-bold rounded-full mt-1">
                            <Tag className="w-3 h-3" />
                            Save {discountPercentage}%
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  {/* Quantity selector */}
                  <div>
                    <label className="block text-sm font-medium text-[#5C8374] mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/80 border border-[#5C8374]/20 rounded-lg px-3 py-2">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="p-1 text-[#5C8374] hover:text-[#77B0AA] transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-[#092635] min-w-[40px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
                          disabled={quantity >= stock}
                          className="p-1 text-[#5C8374] hover:text-[#77B0AA] disabled:text-[#5C8374]/30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-[#5C8374]">
                        Max: {stock} available
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || addingToCart}
                      className={`py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                        !isOutOfStock
                          ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#E3FEF7] hover:shadow-lg hover:shadow-[#5C8374]/30"
                          : "bg-[#5C8374]/20 text-[#5C8374]/50 cursor-not-allowed"
                      }`}
                    >
                      {addingToCart ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className={`py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                        !isOutOfStock
                          ? "bg-gradient-to-r from-[#FF9800] to-[#FFB74D] text-white hover:shadow-lg hover:shadow-[#FF9800]/30"
                          : "bg-[#FF9800]/20 text-[#FF9800]/50 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Buy Now
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToWishlist}
                    disabled={addingToWishlist}
                    className="w-full py-3 bg-transparent border-2 border-[#FF4081] text-[#FF4081] font-bold rounded-xl hover:bg-[#FF4081]/10 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {addingToWishlist ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Heart className="w-5 h-5" />
                    )}
                    {addingToWishlist ? "Adding..." : "Add to Wishlist"}
                  </motion.button>
                </div>

                {/* Delivery info */}
                <div className="p-4 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 rounded-lg border border-[#5C8374]/10">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#5C8374] mt-0.5" />
                    <div>
                      <div className="font-bold text-[#092635]">Free Delivery</div>
                      <div className="text-sm text-[#5C8374]">
                        Ships in 1-3 business days • Free returns within 14 days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security info */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#5C8374]">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment • 100% Authentic • Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#E3FEF7]">You Might Also Like</h2>
                <p className="text-[#E3FEF7]/60">Discover more amazing artworks</p>
              </div>
              <Sparkles className="w-6 h-6 text-[#77B0AA]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/overview/${item.productId}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden hover:shadow-2xl hover:shadow-[#003C43]/20 transition-all duration-300">
                    {/* Product image */}
                    <div className="relative aspect-square bg-gradient-to-br from-[#5C8374]/10 to-[#77B0AA]/10 overflow-hidden">
                      <img
  src={item.displayImage || item.images?.[0] || "/placeholder.png"}
  alt={item.name}

                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Product info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-[#092635] truncate mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-[#092635]">
                          Rs. {Number(item.price).toFixed(2)}
                        </div>
                        <button className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View all button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-xl hover:bg-[#77B0AA]/10 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}