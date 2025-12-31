import { Link } from "react-router-dom";
import { Star, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, viewMode = "grid" }) {
  // Helper function to format price
  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  // Calculate discount percentage if labelledPrice exists
  const discountPercentage = product.labelledPrice && product.labelledPrice > product.price
    ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
    : 0;

  // Determine stock status
  const stockStatus = product.isAvailable && product.stock > 0 ? "in-stock" : "out-of-stock";

  // For list view
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Link
          to={"/overview/" + product.productId}
          className="group flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-2xl hover:border-[#1B4242] hover:shadow-lg transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
        >
          {/* Dark green hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4242] to-[#092635] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          
          {/* Product Image */}
          <div className="relative flex-shrink-0 z-10">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-[#5C8374]/5 to-[#77B0AA]/5 group-hover:from-[#5C8374]/10 group-hover:to-[#77B0AA]/10 transition-all duration-300">
              {product.displayImage ? (
                <img
                  src={product.displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%235C8374' opacity='0.1'/%3E%3Cpath d='M50 30L70 70H30L50 30Z' fill='%2377B0AA' opacity='0.3'/%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Palette className="w-12 h-12 text-[#77B0AA]" />
                </div>
              )}
            </div>
            
            {/* Stock Badge */}
            <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${
              stockStatus === "in-stock"
                ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white shadow"
                : "bg-gradient-to-r from-[#003C43] to-[#135D66] text-white"
            }`}>
              {stockStatus === "in-stock" ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-h-0 z-10">
            {/* Category/Tag */}
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-1 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded text-xs text-[#5C8374] font-medium border border-[#5C8374]/20 group-hover:bg-gradient-to-r group-hover:from-[#5C8374] group-hover:to-[#77B0AA] group-hover:text-white transition-all duration-300">
                {product.category || "Artwork"}
              </div>
              {discountPercentage > 0 && (
                <div className="px-2 py-1 bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] rounded text-xs text-[#092635] font-bold border border-[#9EC8B9]/30 group-hover:bg-gradient-to-r group-hover:from-[#E3FEF7] group-hover:to-[#9EC8B9] transition-all duration-300">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-[#1B4242] transition-colors duration-300">
              {product.name}
            </h3>

            {/* Product Description */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-10 group-hover:text-gray-700 transition-colors duration-300">
              {product.description || "Hand-drawn anime artwork created with passion and precision."}
            </p>

            {/* Rating and Price */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                {/* Price */}
               <div className="flex items-center gap-2">
  {discountPercentage > 0 && (
    <span className="text-sm text-gray-400 line-through">
      {formatPrice(product.labelledPrice)}
    </span>
  )}
  <span className="text-xl font-bold bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent ml-2">
    {formatPrice(product.price)}
  </span>
</div>




                
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view (default) - Fixed height card with dark green hover
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link
        to={"/overview/" + product.productId}
        className="group block w-full bg-white border border-gray-200 rounded-2xl hover:border-[#1B4242] hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col relative"
      >
        {/* Dark green hover overlay for entire card */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4242] to-[#092635] opacity-0 group-hover:opacity-5 transition-opacity duration-300 z-0"></div>
        
        {/* Product Image Container - Fixed height */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#5C8374]/5 to-[#77B0AA]/5 z-10">
          {/* Image */}
          <div className="absolute inset-0">
            {product.displayImage ? (
              <img
                src={product.displayImage}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%235C8374' opacity='0.1'/%3E%3Cpath d='M200 100L300 250H100L200 100Z' fill='%2377B0AA' opacity='0.3'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-family='Arial' font-size='16' fill='%2377B0AA'%3EAnime Art%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Palette className="w-12 h-12 text-[#77B0AA]" />
              </div>
            )}
          </div>

          {/* Dark green overlay on image hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4242]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {/* Stock Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              stockStatus === "in-stock"
                ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white shadow group-hover:from-[#1B4242] group-hover:to-[#5C8374] transition-all duration-300"
                : "bg-gradient-to-r from-[#003C43] to-[#135D66] text-white group-hover:from-[#092635] group-hover:to-[#1B4242] transition-all duration-300"
            }`}>
              {stockStatus === "in-stock" ? "In Stock" : "Sold Out"}
            </div>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="px-3 py-1 bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] rounded-full text-xs font-bold text-[#092635] shadow group-hover:bg-gradient-to-r group-hover:from-[#E3FEF7] group-hover:to-[#9EC8B9] transition-all duration-300">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Quick View Dark Green Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gradient-to-r from-[#1B4242]/90 to-[#092635]/90 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              View Details
            </div>
          </div>
        </div>

        {/* Product Details - Fixed height section */}
        <div className="p-4 flex-1 flex flex-col z-10">
          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="px-2 py-1 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 rounded-full text-xs text-[#5C8374] font-medium border border-[#5C8374]/20 group-hover:bg-gradient-to-r group-hover:from-[#5C8374] group-hover:to-[#77B0AA] group-hover:text-white transition-all duration-300">
              {product.category || "Hand Drawn"}
            </div>
            
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#1B4242] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-gray-600 line-clamp-2 flex-1 mb-3 group-hover:text-gray-700 transition-colors duration-300">
            {product.description || "Premium hand-drawn anime artwork"}
          </p>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-gray-100 group-hover:border-[#1B4242]/20 transition-colors duration-300">
           <div className="flex items-center gap-2">
  {discountPercentage > 0 && (
    <span className="text-sm text-gray-400 line-through">
      {formatPrice(product.labelledPrice)}
    </span>
  )}
  <span className="text-xl font-bold bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent ml-2">
    {formatPrice(product.price)}
  </span>
</div>



            {product.stock > 0 && (
              <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                {product.stock} units available
              </p>
            )}
          </div>
        </div>

        {/* Bottom dark green accent on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </Link>
    </motion.div>
  );
}