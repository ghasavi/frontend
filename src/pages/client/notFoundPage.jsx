import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  AlertTriangle, 
  Compass, 
  Search,
  Sparkles,
  Palette,
  Brush
} from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleExplore = () => {
    navigate("/products");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, ${i % 3 === 0 ? '#5C8374' : i % 3 === 1 ? '#9EC8B9' : '#77B0AA'})`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-2xl"
        >
          {/* Main content */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-[#003C43]/30 overflow-hidden">
            {/* Decorative header */}
            <div className="relative h-48 bg-gradient-to-r from-[#5C8374]/20 via-[#77B0AA]/20 to-[#9EC8B9]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/30 to-transparent"></div>
              <div className="relative h-full flex flex-col items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-6"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#5C8374]/30 to-[#77B0AA]/30 flex items-center justify-center border-8 border-white/20">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FF9800]/30 to-[#FFB74D]/30 flex items-center justify-center border-4 border-white/30">
                        <AlertTriangle className="w-16 h-16 text-[#FF9800]" />
                      </div>
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
                    <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-[#77B0AA] animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h1 className="text-7xl md:text-8xl font-bold text-[#E3FEF7] mb-4">
                  404
                </h1>
                <div className="relative inline-block">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#E3FEF7] mb-4">
                    Page Not Found
                  </h2>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"></div>
                </div>
                <p className="text-xl text-[#E3FEF7]/80 mt-6 mb-2">
                  Oops! The art you're looking for seems to have vanished...
                </p>
                <p className="text-[#E3FEF7]/60 max-w-md mx-auto">
                  The page you requested could not be found. It might have been moved, deleted, or never existed.
                </p>
              </motion.div>

              {/* Search suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5C8374]" />
                  <input
                    type="text"
                    placeholder="Search for amazing anime art instead..."
                    className="w-full pl-12 pr-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-xl text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    readOnly
                    onClick={() => navigate("/products")}
                  />
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoBack}
                  className="p-5 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl hover:border-[#77B0AA] hover:from-[#5C8374]/30 hover:to-[#77B0AA]/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowLeft className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#E3FEF7]">Go Back</div>
                      <div className="text-sm text-[#E3FEF7]/60">Return to previous page</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoHome}
                  className="p-5 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl hover:border-[#77B0AA] hover:from-[#5C8374]/30 hover:to-[#77B0AA]/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#E3FEF7]">Go Home</div>
                      <div className="text-sm text-[#E3FEF7]/60">Back to homepage</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExplore}
                  className="p-5 bg-gradient-to-r from-[#FF9800]/20 to-[#FFB74D]/20 backdrop-blur-sm border border-[#FF9800]/30 rounded-xl hover:border-[#FFB74D] hover:from-[#FF9800]/30 hover:to-[#FFB74D]/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9800] to-[#FFB74D] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#E3FEF7]">Explore</div>
                      <div className="text-sm text-[#E3FEF7]/60">Discover artworks</div>
                    </div>
                  </div>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5 }}
                className="my-10 h-px bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"
              ></motion.div>

              {/* Additional help */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-[#E3FEF7]/60 mb-6">Still lost? Here's what you can do:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-[#092635]/30 border border-[#5C8374]/20">
                    <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                      <Search className="w-4 h-4" />
                      <span className="font-medium">Search</span>
                    </div>
                    <div className="text-[#E3FEF7]/80">
                      Use the search bar to find specific content
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#092635]/30 border border-[#5C8374]/20">
                    <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                      <Palette className="w-4 h-4" />
                      <span className="font-medium">Browse</span>
                    </div>
                    <div className="text-[#E3FEF7]/80">
                      Explore our collection of anime artworks
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#092635]/30 border border-[#5C8374]/20">
                    <div className="flex items-center gap-2 text-[#5C8374] mb-2">
                      <Brush className="w-4 h-4" />
                      <span className="font-medium">Contact</span>
                    </div>
                    <div className="text-[#E3FEF7]/80">
                      Need help? Contact our support team
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#5C8374]/20 bg-gradient-to-r from-[#5C8374]/10 to-transparent">
              <p className="text-center text-sm text-[#5C8374]">
                Error Code: 404 • Pixaku Art Gallery • {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-r from-[#5C8374]/10 to-transparent blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-r from-[#77B0AA]/10 to-transparent blur-xl"></div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFoundPage;