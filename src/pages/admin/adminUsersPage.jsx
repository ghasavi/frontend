import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Calendar,
  Sparkles,
  Download,
  RefreshCw,
  Crown,
  UserCog,
  ArrowLeft
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/users/all");
      setUsers(res.data || []);
      toast.success("Users loaded successfully! 👥");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users 😞");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle block/unblock
  const toggleBlock = async (userId, currentStatus) => {
    const confirm = window.confirm(
      `Are you sure you want to ${currentStatus ? "unblock" : "block"} this user?`
    );
    if (!confirm) return;

    setUpdatingUserId(userId);

    try {
      await api.put(`/users/block/${userId}`, { block: !currentStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlock: !currentStatus } : u
        )
      );
      toast.success(
        `User ${!currentStatus ? "blocked 🔒" : "unblocked 🔓"} successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status 😞");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter and search users
  const filteredUsers = users
    .filter(user => {
      // Search filter
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Role filter
      const matchesRole = filterRole === "all" || user.role === filterRole;
      
      // Status filter
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "active" && !user.isBlock) ||
        (filterStatus === "blocked" && user.isBlock);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "name") {
        return (a.username || "").localeCompare(b.username || "");
      }
      return 0;
    });

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlock).length;
  const blockedUsers = users.filter(u => u.isBlock).length;
  const adminUsers = users.filter(u => u.role === "admin").length;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading users...</p>
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
            <Users className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Users Management</h1>
            <p className="text-[#E3FEF7]/70">
              Manage {totalUsers} user{totalUsers !== 1 ? 's' : ''} in the system
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
                <div className="text-sm text-[#5C8374]">Total Users</div>
                <div className="text-3xl font-bold text-[#092635]">{totalUsers}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#5C8374]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Active Users</div>
                <div className="text-3xl font-bold text-[#4CAF50]">{activeUsers}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4CAF50]/10 to-[#81C784]/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#4CAF50]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Blocked Users</div>
                <div className="text-3xl font-bold text-[#F44336]">{blockedUsers}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F44336]/10 to-[#EF9A9A]/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#F44336]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#5C8374]">Admin Users</div>
                <div className="text-3xl font-bold text-[#FF9800]">{adminUsers}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF9800]/10 to-[#FFB74D]/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#FF9800]" />
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
                  placeholder="Search users by name or email..."
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
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#5C8374]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/90 border border-[#5C8374]/30 rounded-lg text-[#092635] focus:outline-none focus:ring-2 focus:ring-[#77B0AA] transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
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

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
        >
          {/* Table header */}
          <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#092635]">User Accounts</h2>
              <div className="text-sm text-[#5C8374]">
                Showing {filteredUsers.length} of {totalUsers} users
              </div>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#5C8374]/10">
                  <th className="text-left p-4 text-[#5C8374] font-medium">User</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Email</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Role</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Status</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Joined</th>
                  <th className="text-left p-4 text-[#5C8374] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-[#5C8374]/30" />
                        <p className="text-[#5C8374]">No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-[#5C8374]/5 hover:bg-white/50 transition-colors ${
                          user.isBlock ? 'bg-[#F44336]/5' : ''
                        }`}
                      >
                        {/* User Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={user.img || "/user.png"}
                                alt={user.username}
                                className="w-12 h-12 rounded-xl object-cover border border-[#5C8374]/20"
                              />
                              {user.role === "admin" && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF9800] to-[#FFB74D] rounded-full flex items-center justify-center">
                                  <Crown className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-[#092635]">
                                {user.username}
                              </div>
                              <div className="text-sm text-[#5C8374]">
                                ID: {user._id?.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#5C8374]" />
                            <span className="text-[#092635] truncate max-w-[200px]">
                              {user.email}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "admin"
                              ? "bg-gradient-to-r from-[#FF9800]/10 to-[#FFB74D]/10 text-[#FF9800] border border-[#FF9800]/20"
                              : "bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 text-[#5C8374] border border-[#5C8374]/20"
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {user.isBlock ? (
                              <>
                                <XCircle className="w-4 h-4 text-[#F44336]" />
                                <span className="text-[#F44336] font-medium">Blocked</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                                <span className="text-[#4CAF50] font-medium">Active</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="p-4">
                          <div className="text-sm text-[#5C8374]">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleBlock(user._id, user.isBlock)}
                              disabled={updatingUserId === user._id}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                                user.isBlock
                                  ? "bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white hover:shadow-lg hover:shadow-[#4CAF50]/30"
                                  : "bg-gradient-to-r from-[#F44336] to-[#EF9A9A] text-white hover:shadow-lg hover:shadow-[#F44336]/30"
                              } ${updatingUserId === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {updatingUserId === user._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : user.isBlock ? (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <UserX className="w-4 h-4" />
                                  Block
                                </>
                              )}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedUser(user)}
                              className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-[#5C8374]/10 text-[#5C8374] rounded-lg hover:bg-[#5C8374]/20 transition-colors"
                              onClick={() => toast.success("More actions coming soon! ⚙️")}
                            >
                              <MoreVertical className="w-4 h-4" />
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
                Showing {filteredUsers.length} of {totalUsers} users
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

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#092635]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#092635]">User Details</h3>
                      <p className="text-sm text-[#5C8374]">Complete user information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-[#5C8374]/10 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[#092635]" />
                  </button>
                </div>
              </div>

              {/* User details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.img || "/user.png"}
                    alt={selectedUser.username}
                    className="w-20 h-20 rounded-xl object-cover border border-[#5C8374]/20"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-[#092635]">
                      {selectedUser.username}
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block ${
                      selectedUser.role === "admin"
                        ? "bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/20"
                        : "bg-[#5C8374]/10 text-[#5C8374] border border-[#5C8374]/20"
                    }`}>
                      {selectedUser.role.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-[#5C8374]">Email Address</div>
                    <div className="text-[#092635] font-medium">{selectedUser.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[#5C8374]">Account Status</div>
                    <div className="flex items-center gap-2">
                      {selectedUser.isBlock ? (
                        <>
                          <XCircle className="w-4 h-4 text-[#F44336]" />
                          <span className="text-[#F44336] font-medium">Blocked</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                          <span className="text-[#4CAF50] font-medium">Active</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedUser.createdAt && (
                    <div>
                      <div className="text-sm text-[#5C8374]">Joined Date</div>
                      <div className="text-[#092635] font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#5C8374]/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleBlock(selectedUser._id, selectedUser.isBlock);
                      setSelectedUser(null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {selectedUser.isBlock ? (
                      <>
                        <UserCheck className="w-5 h-5" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <UserX className="w-5 h-5" />
                        Block User
                      </>
                    )}
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