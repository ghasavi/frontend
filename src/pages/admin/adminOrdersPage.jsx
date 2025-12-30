import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Trash2,
  Printer,
  X,
  Filter,
  Search,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedRows, setExpandedRows] = useState({});
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const STATUS_OPTIONS = [
    { value: "all", label: "All Orders", color: "from-[#5C8374] to-[#77B0AA]" },
    { value: "pending", label: "Pending", color: "from-[#FFB74D] to-[#FF9800]" },
    { value: "completed", label: "Completed", color: "from-[#4CAF50] to-[#81C784]" },
    { value: "cancelled", label: "Cancelled", color: "from-[#F44336] to-[#EF9A9A]" },
    { value: "returned", label: "Returned", color: "from-[#9C27B0] to-[#BA68C8]" }
  ];

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/orders");
      const ordersData = Array.isArray(res.data) ? res.data : [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      toast.success(`Loaded ${ordersData.length} orders successfully! 📦`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders 😞");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.orderId?.toLowerCase().includes(query) ||
        order.name?.toLowerCase().includes(query) ||
        order.email?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "total") {
        const totalA = Number(a.total) || 0;
        const totalB = Number(b.total) || 0;
        return sortOrder === "desc" ? totalB - totalA : totalA - totalB;
      } else if (sortBy === "status") {
        return sortOrder === "desc" 
          ? (b.status || "").localeCompare(a.status || "")
          : (a.status || "").localeCompare(b.status || "");
      }
      return 0;
    });

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery, sortBy, sortOrder]);

  // Delete order
  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete order ${orderId}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setLoadingOrderId(orderId);
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      toast.success("Order deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order 😞");
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Update order status
  const updateStatus = async (orderId, status) => {
    setLoadingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/${status}`);
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status } : o)
      );
      if (activeOrder?.orderId === orderId) {
        setActiveOrder(prev => ({ ...prev, status }));
      }
      toast.success(`Order status updated to ${status}! ✅`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status 😞");
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Toggle row expansion
  const toggleRowExpand = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "from-[#FFB74D] to-[#FF9800]", text: "Pending", icon: Clock },
      completed: { bg: "from-[#4CAF50] to-[#81C784]", text: "Completed", icon: CheckCircle },
      cancelled: { bg: "from-[#F44336] to-[#EF9A9A]", text: "Cancelled", icon: XCircle },
      returned: { bg: "from-[#9C27B0] to-[#BA68C8]", text: "Returned", icon: ArrowRight }
    };
    return config[status] || config.pending;
  };

  // Statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading orders...</p>
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
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Orders Management</h1>
            <p className="text-[#E3FEF7]/70">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} • Rs. {totalRevenue.toLocaleString()} total
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
          {[
            { label: "Total Orders", value: totalOrders, icon: Package, color: "from-[#5C8374] to-[#77B0AA]" },
            { label: "Pending Orders", value: pendingOrders, icon: Clock, color: "from-[#FFB74D] to-[#FF9800]" },
            { label: "Completed Orders", value: completedOrders, icon: CheckCircle, color: "from-[#4CAF50] to-[#81C784]" },
            { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-[#9C27B0] to-[#BA68C8]" }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#5C8374]">{stat.label}</div>
                  <div className={`text-2xl font-bold ${
                    stat.label.includes("Revenue") ? "text-[#092635]" : "text-[#092635]"
                  }`}>
                    {stat.value}
                  </div>
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
                  placeholder="Search orders by ID, name, email, or phone..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                <Calendar className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Amount</option>
                  <option value="status">Sort by Status</option>
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
                onClick={fetchOrders}
                className="px-4 py-2.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </motion.button>

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

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
        >
          {/* Table header */}
          <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#092635]">Order List</h2>
              <div className="text-sm text-[#5C8374]">
                Showing {filteredOrders.length} of {totalOrders} orders
              </div>
            </div>
          </div>

          {/* Orders list */}
          <div className="divide-y divide-[#5C8374]/10">
            <AnimatePresence>
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <ShoppingBag className="w-16 h-16 text-[#5C8374]/30 mx-auto mb-4" />
                  <p className="text-[#5C8374] text-lg mb-2">No orders found</p>
                  <p className="text-[#5C8374]/60 text-sm">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No orders have been placed yet"}
                  </p>
                </motion.div>
              ) : (
                filteredOrders.map((order, index) => {
                  const statusConfig = getStatusBadge(order.status);
                  const Icon = statusConfig.icon;
                  const isExpanded = expandedRows[order.orderId];

                  return (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${isExpanded ? 'bg-gradient-to-r from-[#5C8374]/5 to-transparent' : ''}`}
                    >
                      {/* Order summary row */}
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig.bg} text-white text-xs font-bold flex items-center gap-1`}>
                              <Icon className="w-3 h-3" />
                              {statusConfig.text}
                            </div>
                            <div>
                              <div className="font-bold text-[#092635]">#{order.orderId}</div>
                              <div className="text-sm text-[#5C8374]">
                                {new Date(order.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-[#5C8374]">Customer</div>
                            <div className="font-medium text-[#092635]">{order.name}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-[#5C8374]">Items</div>
                            <div className="font-medium text-[#092635]">{order.products?.length || 0}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-[#5C8374]">Total</div>
                            <div className="text-xl font-bold text-[#092635]">
                              Rs. {Number(order.total).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRowExpand(order.orderId)}
                            className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setActiveOrder(order);
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 text-[#5C8374] rounded-lg hover:from-[#5C8374]/20 hover:to-[#77B0AA]/20 transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteOrder(order.orderId)}
                            disabled={loadingOrderId === order.orderId}
                            className="p-2 bg-[#F44336]/10 text-[#F44336] rounded-lg hover:bg-[#F44336]/20 disabled:opacity-50 transition-colors"
                          >
                            {loadingOrderId === order.orderId ? (
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
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[#5C8374]">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">Customer</span>
                                  </div>
                                  <div className="text-[#092635]">{order.name}</div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[#5C8374]">
                                    <Mail className="w-4 h-4" />
                                    <span className="font-medium">Email</span>
                                  </div>
                                  <div className="text-[#092635]">{order.email}</div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[#5C8374]">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-medium">Phone</span>
                                  </div>
                                  <div className="text-[#092635]">{order.phone}</div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="font-medium">Address</span>
                                </div>
                                <div className="text-[#092635]">{order.address}</div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-[#5C8374] font-medium">Status:</span>
                                  <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.orderId, e.target.value)}
                                    disabled={loadingOrderId === order.orderId}
                                    className="px-3 py-1.5 bg-white border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] disabled:opacity-50"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="returned">Returned</option>
                                  </select>
                                </div>
                                
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setActiveOrder(order);
                                      setIsModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Full Details
                                  </motion.button>
                                </div>
                              </div>
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
                Showing {filteredOrders.length} of {totalOrders} orders
              </div>
              <div className="flex items-center gap-4">
                <span>Total Revenue: <span className="font-bold text-[#092635]">Rs. {totalRevenue.toLocaleString()}</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && activeOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#092635]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-gradient-to-b from-white to-[#E3FEF7] border border-[#5C8374]/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#092635]">Order Details</h3>
                      <p className="text-sm text-[#5C8374]">#{activeOrder.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 bg-[#F44336]/10 text-[#F44336] rounded-lg hover:bg-[#F44336]/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Order status */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-[#5C8374]">Status</div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const statusConfig = getStatusBadge(activeOrder.status);
                          const Icon = statusConfig.icon;
                          return (
                            <>
                              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig.bg} text-white text-sm font-bold flex items-center gap-2`}>
                                <Icon className="w-4 h-4" />
                                {statusConfig.text}
                              </div>
                              <select
                                value={activeOrder.status}
                                onChange={(e) => updateStatus(activeOrder.orderId, e.target.value)}
                                disabled={loadingOrderId === activeOrder.orderId}
                                className="px-3 py-1 bg-white border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA]"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="returned">Returned</option>
                              </select>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#092635]">
                      Rs. {Number(activeOrder.total).toLocaleString()}
                    </div>
                    <div className="text-sm text-[#5C8374]">Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6 space-y-6">
                {/* Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-[#092635] mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#5C8374]" />
                      Customer Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-[#5C8374]">Full Name</div>
                        <div className="text-[#092635] font-medium">{activeOrder.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#5C8374]">Email Address</div>
                        <div className="text-[#092635] font-medium">{activeOrder.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#5C8374]">Phone Number</div>
                        <div className="text-[#092635] font-medium">{activeOrder.phone}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#092635] mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#5C8374]" />
                      Delivery Information
                    </h4>
                    <div>
                      <div className="text-sm text-[#5C8374] mb-1">Address</div>
                      <div className="text-[#092635] font-medium">{activeOrder.address}</div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-[#5C8374] mb-1">Order Date</div>
                      <div className="text-[#092635] font-medium">
                        {new Date(activeOrder.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="text-lg font-bold text-[#092635] mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#5C8374]" />
                    Ordered Products ({activeOrder.products?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {activeOrder.products?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#5C8374]/5 to-transparent border border-[#5C8374]/10"
                      >
                        <img
                          src={item.productInfo?.images?.[0]}
                          alt={item.productInfo?.name}
                          className="w-16 h-16 rounded-lg object-cover border border-[#5C8374]/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#092635] truncate">
                            {item.productInfo?.name}
                          </div>
                          <div className="text-sm text-[#5C8374]">
                            Quantity: {item.quantity} × Rs. {item.productInfo?.price}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#092635]">
                            Rs. {(item.productInfo?.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}