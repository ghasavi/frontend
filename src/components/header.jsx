import { Link, useNavigate } from "react-router-dom";
import { BsCart3, BsChevronDown } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
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
      setScrolled(window.scrollY > 10);
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

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'h-16 bg-white/95 backdrop-blur-sm border-b border-[#E7F2EF]/30 shadow-sm' 
          : 'h-20 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-md hover:bg-[#E7F2EF]/30 transition-colors"
          onClick={() => setSideDrawerOpened(true)}
        >
          <GiHamburgerMenu className="text-xl text-[#19183B]" />
        </motion.button>

        {/* Logo - Left aligned */}
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
              <div className="absolute -inset-2 bg-[#A1C2BD]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src="/logo.png"
                alt="Pixaku"
                className="relative w-10 h-10 object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "/default-logo.png"; }}
              />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-[#19183B]">
              pixaku
            </span>
          </div>
        </motion.div>

        {/* Navigation Links - Center aligned */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {[
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/products" },
            { name: "Artists", path: "/artists" },
            { name: "About", path: "/about" }
          ].map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ y: -2 }}
              className="relative"
            >
              <Link
                to={item.path}
                className="text-[#19183B] hover:text-[#708993] font-medium text-[15px] tracking-wide transition-colors duration-200"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#A1C2BD] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link to="/cart" className="p-2 block">
              <BsCart3 className="text-xl text-[#19183B] hover:text-[#708993] transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#19183B] text-[#E7F2EF] text-xs rounded-full flex items-center justify-center font-medium">
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
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#E7F2EF]/40 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E7F2EF]">
                <img
                  src={user?.img || "/defaultUser.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/defaultUser.png"; }}
                />
              </div>
              <BsChevronDown className={`text-xs text-[#708993] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-[#E7F2EF] overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-[#E7F2EF]">
                    <p className="text-sm font-medium text-[#19183B]">{user.name}</p>
                    <p className="text-xs text-[#708993] truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {[
                      { name: "Profile", emoji: "👤" },
                      { name: "My Orders", emoji: "📦" },
                      { name: "Wishlist", emoji: "💖" },
                      { name: "Reviews", emoji: "⭐" }
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(`/${item.name.toLowerCase().replace(" ", "")}`);
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#19183B] hover:bg-[#E7F2EF]/30 hover:text-[#708993] transition-colors flex items-center space-x-3"
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                    
                    <div className="border-t border-[#E7F2EF] my-1"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#708993] hover:bg-[#E7F2EF]/30 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-base">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {sideDrawerOpened && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#19183B]/20 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setSideDrawerOpened(false)}
              />
              
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed left-0 top-0 h-full w-72 bg-white z-50 border-r border-[#E7F2EF] shadow-xl"
              >
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#E7F2EF]">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo.png"
                      alt="Pixaku"
                      className="w-8 h-8"
                    />
                    <span className="text-xl font-bold text-[#19183B]">pixaku</span>
                  </div>
                  <button
                    onClick={() => setSideDrawerOpened(false)}
                    className="p-2 hover:bg-[#E7F2EF]/30 rounded-md transition-colors"
                  >
                    <span className="text-lg text-[#708993]">✕</span>
                  </button>
                </div>

                <div className="p-6">
                  <div className="space-y-1">
                    {["Home", "Gallery", "Artists", "About"].map((item) => (
                      <Link
                        key={item}
                        to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                        className="block py-3 px-4 text-[#19183B] hover:bg-[#E7F2EF]/30 hover:text-[#708993] rounded-md transition-colors"
                        onClick={() => setSideDrawerOpened(false)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E7F2EF]">
                    <Link
                      to="/cart"
                      className="flex items-center justify-between py-3 px-4 text-[#19183B] hover:bg-[#E7F2EF]/30 rounded-md transition-colors"
                      onClick={() => setSideDrawerOpened(false)}
                    >
                      <span>Cart</span>
                      <BsCart3 className="text-lg" />
                    </Link>

                    {user ? (
                      <>
                        <div className="mt-4 p-4 bg-[#E7F2EF]/20 rounded-lg">
                          <p className="text-sm font-medium text-[#19183B]">{user.name}</p>
                          <p className="text-xs text-[#708993] truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setSideDrawerOpened(false);
                          }}
                          className="w-full mt-3 py-3 px-4 text-sm text-[#708993] hover:bg-[#E7F2EF]/30 rounded-md transition-colors text-left"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          navigate("/login");
                          setSideDrawerOpened(false);
                        }}
                        className="w-full mt-4 py-3 px-4 bg-[#19183B] text-white rounded-md font-medium hover:bg-[#19183B]/90 transition-colors"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}