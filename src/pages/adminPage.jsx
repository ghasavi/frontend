import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  AlertCircle,
  Home,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Palette,
  ShoppingCart
} from "lucide-react";

// Admin Pages
import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";
import AdminReviewsPage from "./admin/adminReviewsPage";
import NotFoundPage from "./client/notFoundPage";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthenticated");
        navigate("/login");
        return;
      }

      try {
        setStatus("loading");
        // This route checks if user is admin
        const res = await api.get("/users/check-admin");
        if (res.data.user.role !== "admin") {
          setStatus("unauthorized");
          toast.error("You are not authorized to access admin panel");
          navigate("/");
        } else {
          setUser(res.data.user);
          setStatus("authenticated");
          fetchDashboardStats();
        }
      } catch (err) {
        console.error(err);
        setStatus("unauthenticated");
        toast.error("You are not authenticated, please login");
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get("/orders"),
        api.get("/products"),
        api.get("/users/all")
      ]);

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];

      setDashboardStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/products",
      label: "Products",
      icon: Package,
      description: "Manage artworks",
      stat: dashboardStats.totalProducts
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
      description: "User management",
      stat: dashboardStats.totalUsers
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      description: "Customer orders",
      stat: dashboardStats.totalOrders
    },
    {
      path: "/admin/reviews",
      label: "Reviews",
      icon: MessageSquare,
      description: "Customer feedback"
    }
  ];

  const getPageTitle = () => {
    const item = menuItems.find(item => path.includes(item.path.replace('/admin/', '')));
    return item ? item.label : "Dashboard";
  };

  const getPageDescription = () => {
    const item = menuItems.find(item => path.includes(item.path.replace('/admin/', '')));
    return item ? item.description : "Admin Dashboard";
  };

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "unauthorized") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43]">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="menu-button fixed top-4 left-4 z-50 lg:hidden p-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          transition={{ type: "spring", damping: 25 }}
          className="sidebar fixed lg:relative h-screen w-80 lg:w-1/4 xl:w-1/5 bg-gradient-to-b from-[#1B4242]/90 to-[#092635]/90 backdrop-blur-sm border-r border-[#5C8374]/30 z-40 overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/5 to-[#9EC8B9]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/5 to-[#77B0AA]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Admin header */}
            <div className="p-6 border-b border-[#5C8374]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF9800] to-[#FFB74D] flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-[#E3FEF7]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#E3FEF7]">Admin Panel</h1>
                  <p className="text-sm text-[#E3FEF7]/60">Pixaku Management</p>
                </div>
              </div>

              {/* User profile */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm border border-[#5C8374]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user?.avatar || "/defaultUser.png"}
                      alt={user?.username}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#5C8374]/50"
                      onError={(e) => (e.target.src = "/defaultUser.png")}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#4CAF50] to-[#81C784] rounded-full border-2 border-[#1B4242] flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#E3FEF7] truncate">
                      {user?.username || "Admin User"}
                    </div>
                    <div className="text-sm text-[#E3FEF7]/60 truncate">
                      {user?.email || "admin@pixaku.com"}
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#FF9800]" />
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6 overflow-y-auto">
              <nav className="space-y-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/admin"
                    className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      path === "/admin" || path === "/admin/dashboard"
                        ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] shadow-lg shadow-[#5C8374]/30"
                        : "bg-[#092635]/30 hover:bg-[#092635]/50 border border-[#5C8374]/20 hover:border-[#5C8374]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        path === "/admin" || path === "/admin/dashboard"
                          ? "bg-white/20" 
                          : "bg-[#5C8374]/10 group-hover:bg-[#5C8374]/20"
                      }`}>
                        <LayoutDashboard className={`w-5 h-5 ${
                          path === "/admin" || path === "/admin/dashboard" ? "text-white" : "text-[#5C8374]"
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${
                          path === "/admin" || path === "/admin/dashboard" ? "text-white" : "text-[#E3FEF7]"
                        }`}>
                          Dashboard
                        </div>
                        <div className={`text-sm ${
                          path === "/admin" || path === "/admin/dashboard" ? "text-white/80" : "text-[#E3FEF7]/60"
                        }`}>
                          Overview & analytics
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${
                      path === "/admin" || path === "/admin/dashboard" ? "text-white" : "text-[#5C8374]"
                    }`} />
                  </Link>
                </motion.div>

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = path.includes(item.path);
                  
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] shadow-lg shadow-[#5C8374]/30"
                            : "bg-[#092635]/30 hover:bg-[#092635]/50 border border-[#5C8374]/20 hover:border-[#5C8374]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            active 
                              ? "bg-white/20" 
                              : "bg-[#5C8374]/10 group-hover:bg-[#5C8374]/20"
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              active ? "text-white" : "text-[#5C8374]"
                            }`} />
                          </div>
                          <div className="text-left">
                            <div className={`font-medium ${
                              active ? "text-white" : "text-[#E3FEF7]"
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-sm ${
                              active ? "text-white/80" : "text-[#E3FEF7]/60"
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.stat !== undefined && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-[#5C8374]/20 text-[#E3FEF7]"
                            }`}>
                              {item.stat}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 ${
                            active ? "text-white" : "text-[#5C8374]"
                          }`} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Quick stats */}
              <div className="mt-8 pt-8 border-t border-[#5C8374]/20">
                <h3 className="text-sm font-medium text-[#E3FEF7]/60 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#092635]/30 border border-[#5C8374]/20">
                    <span className="text-sm text-[#E3FEF7]/60">Total Revenue</span>
                    <span className="font-bold text-[#E3FEF7]">
                      Rs. {dashboardStats.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#092635]/30 border border-[#5C8374]/20">
                    <span className="text-sm text-[#E3FEF7]/60">Pending Orders</span>
                    <span className="font-bold text-[#E3FEF7]">
                      {dashboardStats.pendingOrders}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign out button */}
            <div className="p-6 border-t border-[#5C8374]/20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="w-full py-3 bg-gradient-to-r from-[#F44336] to-[#EF9A9A] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#F44336]/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </motion.button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-[#E3FEF7]/60 hover:text-[#E3FEF7] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Home className="w-4 h-4" />
                  Back to Store
                </button>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-y-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-30 p-6 bg-gradient-to-r from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border-b border-[#5C8374]/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#E3FEF7]">
                  {getPageTitle()}
                </h2>
                <p className="text-[#E3FEF7]/60">
                  {getPageDescription()}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5C8374]" />
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="pl-10 pr-4 py-2.5 bg-[#092635]/50 border border-[#5C8374]/30 rounded-xl text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all w-64"
                  />
                </div>

                {/* Refresh stats */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchDashboardStats}
                  disabled={loadingStats}
                  className="p-2.5 bg-[#092635]/50 border border-[#5C8374]/30 rounded-xl text-[#E3FEF7] hover:bg-[#092635]/80 disabled:opacity-50 transition-colors"
                >
                  {loadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <BarChart3 className="w-5 h-5" />
                  )}
                </motion.button>

                {/* Add Product Button */}
                {path.includes("/admin/products") && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/admin/add-product")}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white rounded-xl hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    Add Product
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-[#5C8374]/20 rounded-2xl shadow-xl shadow-[#003C43]/10 min-h-[calc(100vh-200px)]"
              >
                <div className="p-6 md:p-8">
                  <Routes>
                    <Route path="/" element={
                      <div className="py-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 flex items-center justify-center border border-[#5C8374]/30">
                          <LayoutDashboard className="w-12 h-12 text-[#5C8374]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#E3FEF7] mb-4">Welcome to Admin Dashboard</h2>
                        <p className="text-[#E3FEF7]/70 max-w-2xl mx-auto mb-8">
                          Manage your Pixaku store, products, orders, and users from this centralized admin panel.
                          Use the sidebar navigation to access different sections.
                        </p>
                        
                        {/* Quick stats grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                          {[
                            { 
                              label: "Total Orders", 
                              value: dashboardStats.totalOrders, 
                              icon: ShoppingBag, 
                              color: "from-[#5C8374] to-[#77B0AA]",
                              change: "+12%"
                            },
                            { 
                              label: "Total Products", 
                              value: dashboardStats.totalProducts, 
                              icon: Package, 
                              color: "from-[#FF9800] to-[#FFB74D]",
                              change: "+8%"
                            },
                            { 
                              label: "Total Users", 
                              value: dashboardStats.totalUsers, 
                              icon: Users, 
                              color: "from-[#4CAF50] to-[#81C784]",
                              change: "+15%"
                            },
                            { 
                              label: "Total Revenue", 
                              value: `Rs. ${dashboardStats.totalRevenue.toLocaleString()}`, 
                              icon: BarChart3, 
                              color: "from-[#9C27B0] to-[#BA68C8]",
                              change: "+23%"
                            }
                          ].map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                  <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-2xl font-bold text-[#E3FEF7]">{stat.value}</div>
                                  <div className="text-sm text-[#E3FEF7]/60">{stat.label}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-[#E3FEF7]/40">This month</div>
                                <div className="text-xs text-[#4CAF50] flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  {stat.change}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Quick actions */}
                        <div className="max-w-2xl mx-auto">
                          <h3 className="text-xl font-bold text-[#E3FEF7] mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {menuItems.map((item, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(item.path)}
                                className="p-4 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 border border-[#5C8374]/20 rounded-xl hover:border-[#5C8374]/40 transition-all flex items-center gap-3"
                              >
                                <item.icon className="w-5 h-5 text-[#5C8374]" />
                                <span className="text-[#E3FEF7] font-medium">{item.label}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    } />
                    <Route path="/dashboard" element={
                      <div className="py-12 text-center">
                        <h2 className="text-2xl font-bold text-[#E3FEF7]">Dashboard</h2>
                      </div>
                    } />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/edit-product/:id" element={<EditProductPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/orders" element={<AdminOrdersPage />} />
                    <Route path="/reviews" element={<AdminReviewsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#5C8374]/20 bg-gradient-to-r from-[#1B4242]/80 to-[#092635]/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-[#E3FEF7]/60">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4CAF50]" />
                  <span>Admin Panel v1.0</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>System Status: <span className="text-[#4CAF50]">All Operational</span></span>
                </div>
              </div>
              <div>
                <span>© {new Date().getFullYear()} Pixaku. All rights reserved.</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}