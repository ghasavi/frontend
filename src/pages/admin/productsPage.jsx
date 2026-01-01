import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  PackagePlus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Tag,
  DollarSign,
  Box,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/products");
      const productsData = res.data || [];
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      toast.success("Products loaded successfully! 📦");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products 😞");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this product? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingId(productId);
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
      toast.success("Product deleted successfully 🗑️");
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and search products
  const filteredProducts = products
    .filter(product => {
      // Search filter
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      
      // Stock filter
      const matchesStock = filterStock === "all" || 
        (filterStock === "inStock" && product.stock > 0) ||
        (filterStock === "outOfStock" && product.stock === 0) ||
        (filterStock === "lowStock" && product.stock > 0 && product.stock <= 10);
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "priceHigh") {
        return (b.price || 0) - (a.price || 0);
      } else if (sortBy === "priceLow") {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === "stockHigh") {
        return (b.stock || 0) - (a.stock || 0);
      } else if (sortBy === "stockLow") {
        return (a.stock || 0) - (b.stock || 0);
      }
      return 0;
    });

  // Statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading products...</p>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Products Management</h1>
            <p className="text-[#E3FEF7]/70">
              Manage {totalProducts} product{totalProducts !== 1 ? 's' : ''} in the store
            </p>
          </div>
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Total Products</div>
                <div className="text-3xl font-bold text-[#092635]">{totalProducts}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#5C8374]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">In Stock</div>
                <div className="text-3xl font-bold text-[#4CAF50]">{inStockProducts}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4CAF50]/10 to-[#81C784]/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Out of Stock</div>
                <div className="text-3xl font-bold text-[#F44336]">{outOfStockProducts}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F44336]/10 to-[#EF9A9A]/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#F44336]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Total Value</div>
                <div className="text-3xl font-bold text-[#FF9800]">
                  Rs.{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF9800]/10 to-[#FFB74D]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#FF9800]" />
              </div>
            </div>
          </div>
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
                  placeholder="Search products by name, ID, or description..."
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
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="all">All Stock</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                  <option value="lowStock">Low Stock (≤10)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="stockHigh">Stock: High to Low</option>
                  <option value="stockLow">Stock: Low to High</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchProducts}
                className="px-4 py-2.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </motion.button>

              <Link
                to="/admin/add-product"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white rounded-lg hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all duration-300 flex items-center gap-2"
                >
                  <PackagePlus className="w-5 h-5" />
                  Add Product
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#FF9800] to-[#FFB74D] text-white rounded-lg hover:shadow-lg hover:shadow-[#FF9800]/30 transition-all duration-300 flex items-center gap-2"
                onClick={() => toast.success("Export feature coming soon! 📊")}
              >
                <Download className="w-5 h-5" />
                Export
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
        >
          {/* Table header */}
          <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#092635]">Product Catalog</h2>
              <div className="text-sm text-[#5C8374]">
                Showing {filteredProducts.length} of {totalProducts} products
                {lowStockProducts > 0 && (
                  <span className="ml-2 text-[#FF9800]">
                    ({lowStockProducts} low stock)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#5C8374]/10">
                  <th className="text-left p-4 text-[#5C8374] font-medium">Product</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">ID & Category</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Pricing</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Stock</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Value</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="w-12 h-12 text-[#5C8374]/30" />
                        <p className="text-[#5C8374]">No products found matching your criteria</p>
                        <Link
                          to="/admin/add-product"
                          className="mt-2 px-4 py-2 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Add Your First Product
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.productId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-[#5C8374]/5 hover:bg-white/50 transition-colors ${
                          product.stock === 0 ? 'bg-[#F44336]/5' : product.stock <= 10 ? 'bg-[#FF9800]/5' : ''
                        }`}
                      >
                        {/* Product Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
  src={product.displayImage || product.images?.[0] || "/placeholder.png"}
  alt={product.name}


                                className="w-12 h-12 rounded-xl object-cover border border-[#5C8374]/20"
                              />
                              {product.stock === 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#F44336] to-[#EF9A9A] rounded-full flex items-center justify-center">
                                  <XCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {product.stock > 0 && product.stock <= 10 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF9800] to-[#FFB74D] rounded-full flex items-center justify-center">
                                  <AlertCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-[#092635] truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-[#5C8374] truncate">
                                {product.description?.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ID & Category */}
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-[#5C8374]" />
                              <span className="text-sm text-[#092635] font-mono">
                                {product.productId}
                              </span>
                            </div>
                            {product.category && (
                              <span className="inline-block px-2 py-1 bg-[#5C8374]/10 text-[#5C8374] text-xs rounded-full border border-[#5C8374]/20">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-[#4CAF50]" />
                              <span className="text-lg font-bold text-[#092635]">
                                Rs. {product.price?.toFixed(2)}
                              </span>
                            </div>
                            {product.labelledPrice && product.labelledPrice > product.price && (
                              <div className="text-sm text-[#5C8374] line-through">
                                Rs. {product.labelledPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {product.stock === 0 ? (
                              <>
                                <XCircle className="w-4 h-4 text-[#F44336]" />
                                <span className="text-[#F44336] font-medium">Out of Stock</span>
                              </>
                            ) : product.stock <= 10 ? (
                              <>
                                <AlertCircle className="w-4 h-4 text-[#FF9800]" />
                                <span className="text-[#FF9800] font-medium">
                                  Low ({product.stock})
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                                <span className="text-[#4CAF50] font-medium">
                                  {product.stock} units
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Value */}
                        <td className="p-4">
                          <div className="text-sm font-bold text-[#092635]">
                            Rs. {((product.price || 0) * (product.stock || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-[#5C8374]">
                            Total value
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
onClick={() => navigate(`/admin/edit-product/${product.productId}`)}
                              className="px-3 py-2 bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white rounded-lg hover:shadow-lg hover:shadow-[#2196F3]/30 transition-all duration-300 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteProduct(product.productId)}
                              disabled={deletingId === product.productId}
                              className="px-3 py-2 bg-gradient-to-r from-[#F44336] to-[#EF9A9A] text-white rounded-lg hover:shadow-lg hover:shadow-[#F44336]/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === product.productId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Delete
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProduct(product)}
                              className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="p-4 border-t border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-transparent">
            <div className="flex items-center justify-between text-sm text-[#5C8374]">
              <div>
                Showing {filteredProducts.length} of {totalProducts} products
                {lowStockProducts > 0 && (
                  <span className="ml-2">
                    • <span className="text-[#FF9800] font-medium">{lowStockProducts}</span> low stock
                  </span>
                )}
                {outOfStockProducts > 0 && (
                  <span className="ml-2">
                    • <span className="text-[#F44336] font-medium">{outOfStockProducts}</span> out of stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-[#5C8374] hover:text-[#77B0AA] transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  Back to Top
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#092635]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-[#E3FEF7] border border-[#5C8374]/30 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#092635]">Product Details</h3>
                      <p className="text-sm text-[#5C8374]">Complete product information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-[#5C8374]/10 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[#092635]" />
                  </button>
                </div>
              </div>

              {/* Product details */}
              <div className="p-6 space-y-6">
                {/* Product images */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProduct.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.png"}
                        alt={`${selectedProduct.name} - ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#5C8374]/20"
                      />
                      {image === selectedProduct.displayImage && (
  <span className="absolute top-2 left-2 px-2 py-1 bg-[#5C8374] text-white text-xs rounded-full">
    Main
  </span>
)}

                    </div>
                  ))}
                </div>

                {/* Product info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-[#5C8374]">Product Name</div>
                      <div className="text-lg font-bold text-[#092635]">{selectedProduct.name}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[#5C8374]">Product ID</div>
                      <div className="text-[#092635] font-mono">{selectedProduct.productId}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[#5C8374]">Category</div>
                      <span className="inline-block px-3 py-1 bg-[#5C8374]/10 text-[#5C8374] rounded-full border border-[#5C8374]/20">
                        {selectedProduct.category || "Uncategorized"}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[#5C8374]">Description</div>
                      <div className="text-[#092635]">{selectedProduct.description}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-[#5C8374]">Pricing</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#092635]">
                          ${selectedProduct.price?.toFixed(2)}
                        </span>
                        {selectedProduct.labelledPrice && selectedProduct.labelledPrice > selectedProduct.price && (
                          <span className="text-[#5C8374] line-through">
                            ${selectedProduct.labelledPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[#5C8374]">Stock Status</div>
                      <div className="flex items-center gap-2">
                        {selectedProduct.stock === 0 ? (
                          <>
                            <XCircle className="w-5 h-5 text-[#F44336]" />
                            <span className="text-lg text-[#F44336] font-bold">Out of Stock</span>
                          </>
                        ) : selectedProduct.stock <= 10 ? (
                          <>
                            <AlertCircle className="w-5 h-5 text-[#FF9800]" />
                            <span className="text-lg text-[#FF9800] font-bold">
                              Low Stock: {selectedProduct.stock} units
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                            <span className="text-lg text-[#4CAF50] font-bold">
                              In Stock: {selectedProduct.stock} units
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[#5C8374]">Total Value</div>
                      <div className="text-xl font-bold text-[#FF9800]">
                        ${((selectedProduct.price || 0) * (selectedProduct.stock || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#5C8374]/10 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
navigate(`/admin/edit-product/${selectedProduct.productId}`);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#2196F3]/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Product
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      deleteProduct(selectedProduct.productId);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#F44336] to-[#EF9A9A] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#F44336]/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Product
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