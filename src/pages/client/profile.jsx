import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, Edit3, LogOut, Palette, Sparkles, Heart, ShoppingBag, Star, Settings, Package, Award } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) navigate("/login");
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#5C8374] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#E3FEF7]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-[#E3FEF7]" />
          </div>
          <p className="text-[#E3FEF7]">{error}</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm rounded-full border border-[#5C8374]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#E3FEF7]" />
              <span className="text-sm font-medium text-[#E3FEF7]">
                 Your Personal Art Space
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back,{" "}
              <span className="bg-gradient-to-r from-[#9EC8B9] via-[#77B0AA] to-[#5C8374] bg-clip-text text-transparent">
                {user.username}
              </span>
            </h1>
            <p className="text-xl text-[#E3FEF7]/80 max-w-2xl mx-auto">
              Manage your profile, orders, and art preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Profile Card */}
              <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] rounded-full blur opacity-30"></div>
                    <img
                      src={user.img || "/defaultUser.png"}
                      alt="Profile"
                      className="relative w-32 h-32 rounded-full border-4 border-[#5C8374] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/defaultUser.png";
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] border-4 border-[#1B4242] flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                  <div className="flex items-center gap-2 text-[#77B0AA] mb-4">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  <div className="px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA] font-medium">
                    {user.role === "admin" ? "🎨 Artist & Admin" : "🎨 Art Collector"}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#77B0AA]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#77B0AA]">Member Since</p>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#77B0AA]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#77B0AA]">Account Status</p>
                      <p className="text-white font-medium">Active • Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Tabs */}
              <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-6">
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  {[
                    { id: "orders", label: "My Orders", icon: <Package className="w-4 h-4" /> ,link: "/myorders"},
                    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> , link: "/wishlist"},
                    { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> , link: "/reviews"},
                    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> , link: "/editProfile"}
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => navigate(tab.link)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white"
                          : "text-[#77B0AA] hover:text-[#E3FEF7] hover:bg-gradient-to-r hover:from-[#5C8374]/10 hover:to-[#77B0AA]/10"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

             
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/editProfile")}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-medium rounded-xl hover:opacity-90 transition-opacity duration-200"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 text-[#77B0AA] font-medium rounded-xl hover:border-red-500/50 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>

          
        </div>
      </div>
    </div>
  );
}