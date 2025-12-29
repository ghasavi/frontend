import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { Search, Filter, SlidersHorizontal, Grid, List, Sparkles, Palette, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Helper to normalize API response
  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.products && Array.isArray(data.products)) return data.products;
    return [];
  };

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: {
            "ngrok-skip-browser-warning": "1",
          },
        });
        console.log("Fetched products:", res.data);
        setProducts(normalizeProducts(res.data));
      } catch (err) {
        toast.error("Error fetching products");
        console.error("Fetch products error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading && query.length === 0) fetchProducts();
  }, [isLoading, query]);

  // Handle search input
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);

    try {
      let response;
      if (value.length === 0) {
        response = await api.get("/products", {
          headers: { "ngrok-skip-browser-warning": "1" },
        });
      } else {
        response = await api.get(`/products/search/${value}`, {
          headers: { "ngrok-skip-browser-warning": "1" },
        });
      }
      console.log("Search response:", response.data);
      setProducts(normalizeProducts(response.data));
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Search products error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Categories for filtering
  const categories = [
    { id: "all", label: "All Artworks", icon: "🎨" },
    { id: "digital", label: "Digital Art", icon: "💻" },
    { id: "traditional", label: "Traditional", icon: "🖌️" },
    { id: "character", label: "Characters", icon: "👤" },
    { id: "landscape", label: "Landscapes", icon: "🏞️" },
    { id: "fanart", label: "Fan Art", icon: "🌟" }
  ];

  // Sort options
  const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "popular", label: "Most Popular" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43]">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm rounded-full border border-[#5C8374]/30 mb-4">
                <Sparkles className="w-4 h-4 text-[#E3FEF7]" />
                <span className="text-sm font-medium text-[#E3FEF7]">
                  🎨 Explore Our Collection
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Discover{" "}
                <span className="bg-gradient-to-r from-[#9EC8B9] via-[#77B0AA] to-[#5C8374] bg-clip-text text-transparent">
                  Anime Art
                </span>
              </h1>
              
              <p className="text-xl text-[#E3FEF7]/80 max-w-2xl mx-auto">
                Browse through our curated collection of hand-drawn anime artworks
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#77B0AA]" />
                <input
                  type="text"
                  placeholder="Search for characters, styles, or artists..."
                  value={query}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl text-[#E3FEF7] placeholder:text-[#77B0AA] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                />
                {query && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#77B0AA] hover:text-[#E3FEF7]"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635]"
                        : "bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 text-[#77B0AA] hover:text-[#E3FEF7]"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] focus:outline-none focus:ring-2 focus:ring-[#77B0AA]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id} className="bg-[#092635]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-[#77B0AA]" />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 p-1 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635]"
                        : "text-[#77B0AA] hover:text-[#E3FEF7]"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635]"
                        : "text-[#77B0AA] hover:text-[#E3FEF7]"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Display */}
      <div className="px-4 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loading />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 rounded-2xl flex items-center justify-center">
                <Palette className="w-12 h-12 text-[#77B0AA]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {query.length === 0
                  ? "No artworks available yet"
                  : "No artworks match your search"}
              </h2>
              <p className="text-[#77B0AA] max-w-md mx-auto mb-6">
                {query.length === 0
                  ? "Check back soon for new additions to our collection!"
                  : "Try searching for different characters or art styles"}
              </p>
              {query.length > 0 && (
                <button
                  onClick={() => setQuery("")}
                  className="px-6 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {products.length} {products.length === 1 ? "Artwork" : "Artworks"} Found
                  </h3>
                  {query && (
                    <p className="text-[#77B0AA] text-sm">
                      Results for "<span className="text-[#9EC8B9]">{query}</span>"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[#77B0AA] text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{products.length} items • Sorted by {sortOptions.find(o => o.id === sortBy)?.label}</span>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {products.map((product, index) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Load More (if applicable) */}
              {products.length >= 20 && (
                <div className="text-center mt-12">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 text-[#77B0AA] font-medium rounded-lg hover:border-[#9EC8B9] hover:text-[#E3FEF7] transition-all duration-200 flex items-center gap-2 mx-auto">
                    <Zap className="w-4 h-4" />
                    Load More Artworks
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Featured Artists Section */}
      {!isLoading && products.length > 0 && (
        <div className="px-4 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/20 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Discover More Artists
                  </h3>
                  <p className="text-[#77B0AA]">
                    Explore artworks from our talented community of anime artists
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 whitespace-nowrap">
                  View All Artists →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}