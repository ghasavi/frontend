import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Home, Palette, Sparkles, Heart, Package, Users, Info, LogOut, ChevronDown, Settings, ShoppingBag, Star } from "lucide-react";
import { useState, useRef, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClick = () => {
    if (!user) navigate("/login");
    else setProfileOpen(!profileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Gallery", path: "/products", icon: <Palette className="w-4 h-4" /> },
    { name: "Artists", path: "/artists", icon: <Users className="w-4 h-4" /> },
    { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> }
  ];

  const profileItems = [
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> },
    { name: "My Orders", path: "/myorders", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Wishlist", path: "/wishlist", icon: <Heart className="w-4 h-4" /> },
    { name: "Reviews", path: "/reviews", icon: <Star className="w-4 h-4" /> },
    { name: "Settings", path: "/editProfile", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <>
      <header 
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'h-16 bg-white/95 backdrop-blur-lg border-b border-[#5C8374]/20 shadow-lg shadow-[#092635]/5' 
            : 'h-20 bg-white border-b border-[#5C8374]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-[#E3FEF7]/20 transition-colors"
            onClick={() => setSideDrawerOpened(true)}
          >
            <Menu className="w-6 h-6 text-[#5C8374]" />
          </motion.button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent">
                  Pixaku
                </span>
                <span className="text-[10px] text-[#5C8374] tracking-wider">ANIME ART</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation Links - Center aligned */}
          <nav className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C8374] hover:text-[#1B4242] font-medium text-sm tracking-wide transition-all duration-200 group"
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </span>
                  {item.name}
                  <span className="absolute -bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-[#5C8374] to-[#77B0AA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link to="/cart" className="p-2 block relative">
                <ShoppingCart className="w-6 h-6 text-[#5C8374] hover:text-[#1B4242] transition-colors" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                  0
                </span>
              </Link>
            </motion.div>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#E3FEF7]/30 transition-colors duration-200 group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#5C8374]/20 group-hover:border-[#5C8374]/40 transition-colors shadow-sm">
                  <img
                    src={user?.img || "/defaultUser.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/defaultUser.png"; }}
                  />
                </div>
                <ChevronDown className={`w-4 h-4 text-[#5C8374] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-[#5C8374]/20 overflow-hidden z-50"
                  >
                    {/* User Info */}
                    <div className="p-4 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 border-b border-[#5C8374]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5C8374]/30">
                          <img
                            src={user?.img || "/defaultUser.png"}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1B4242] truncate">{user.name}</p>
                          <p className="text-xs text-[#5C8374] truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      {profileItems.map((item) => (
                        <motion.button
                          key={item.name}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            navigate(item.path);
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-[#5C8374] hover:text-[#1B4242] hover:bg-gradient-to-r hover:from-[#5C8374]/5 hover:to-[#77B0AA]/5 transition-all duration-200 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <span>{item.name}</span>
                        </motion.button>
                      ))}
                      
                      {/* Divider */}
                      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-[#5C8374]/20 to-transparent"></div>
                      
                      {/* Logout */}
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#5C8374] hover:text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 transition-all duration-200 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-100 to-red-50 flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-500" />
                        </div>
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sideDrawerOpened && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#092635]/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSideDrawerOpened(false)}
            />
            
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 border-r border-[#5C8374]/20 shadow-2xl shadow-[#092635]/10"
            >
              {/* Drawer Header */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-[#5C8374]/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent">
                      Pixaku
                    </span>
                    <p className="text-[10px] text-[#5C8374] tracking-wider">ANIME ART</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSideDrawerOpened(false)}
                  className="p-2 hover:bg-[#E3FEF7]/30 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#5C8374]" />
                </motion.button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 h-[calc(100vh-5rem)] overflow-y-auto">
                {/* Navigation */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-semibold text-[#5C8374] uppercase tracking-wider mb-3">NAVIGATION</p>
                  {navItems.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ x: 4 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 py-3 px-4 text-[#5C8374] hover:text-[#1B4242] hover:bg-gradient-to-r hover:from-[#5C8374]/5 hover:to-[#77B0AA]/5 rounded-lg transition-all duration-200"
                        onClick={() => setSideDrawerOpened(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* User Section */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-semibold text-[#5C8374] uppercase tracking-wider mb-3">ACCOUNT</p>
                  <motion.div
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      to="/cart"
                      className="flex items-center justify-between py-3 px-4 text-[#5C8374] hover:text-[#1B4242] hover:bg-gradient-to-r hover:from-[#5C8374]/5 hover:to-[#77B0AA]/5 rounded-lg transition-all duration-200"
                      onClick={() => setSideDrawerOpened(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Cart</span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-xs flex items-center justify-center font-medium">
                        0
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* User Info & Actions */}
                {user ? (
                  <>
                    <div className="p-4 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5 rounded-xl mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5C8374]/30">
                          <img
                            src={user?.img || "/defaultUser.png"}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1B4242]">{user.name}</p>
                          <p className="text-xs text-[#5C8374] truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setSideDrawerOpened(false);
                          }}
                          className="text-xs text-[#5C8374] hover:text-[#1B4242] hover:bg-white/50 py-1.5 rounded-md transition-colors"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setSideDrawerOpened(false);
                          }}
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-md transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setSideDrawerOpened(false);
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setSideDrawerOpened(false);
                      }}
                      className="w-full py-3 px-4 bg-white border border-[#5C8374] text-[#5C8374] font-medium rounded-lg hover:bg-[#5C8374]/5 transition-colors duration-200"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className={`transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}></div>
    </>
  );
}