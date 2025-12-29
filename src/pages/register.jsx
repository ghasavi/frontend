import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { Paintbrush, Sparkles, Palette, User, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    if (!username || !email || !password)
      return toast.error("All fields are required");

    try {
      await api.post("/users", { username, email, password });
      toast.success("🎉 Registration Successful! Welcome to Pixaku!");
      navigate("/login");
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Registration Failed");
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating color blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        
        {/* Anime art style floating elements */}
        {[...Array(15)].map((_, i) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Register card */}
        <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl shadow-2xl shadow-[#003C43]/20 overflow-hidden">
          
          {/* Decorative header */}
          <div className="relative h-32 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#9EC8B9] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/20 to-transparent"></div>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 rounded-lg bg-[#092635]/30 backdrop-blur-sm border border-[#E3FEF7]/20 hover:bg-[#092635]/50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-[#E3FEF7]" />
            </button>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#092635]/30 backdrop-blur-sm border border-[#E3FEF7]/20 flex items-center justify-center">
                <Paintbrush className="w-6 h-6 text-[#E3FEF7]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E3FEF7]">Join Pixaku</h1>
                <p className="text-sm text-[#E3FEF7]/80">Start your art journey</p>
              </div>
            </div>
            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-[#E3FEF7]" />
          </div>

          {/* Form content */}
          <div className="p-8">
            {/* Username input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                <User className="w-4 h-4 text-[#77B0AA]" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a creative name"
                  className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-[#5C8374] mt-1">
                This will be your public display name
              </p>
            </div>

            {/* Email input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                <Mail className="w-4 h-4 text-[#77B0AA]" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@example.com"
                  className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                <Lock className="w-4 h-4 text-[#77B0AA]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C8374] hover:text-[#9EC8B9] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-[#5C8374]' : 'bg-[#5C8374]/30'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-[#77B0AA]' : 'bg-[#5C8374]/30'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${/\d/.test(password) ? 'bg-[#9EC8B9]' : 'bg-[#5C8374]/30'}`}></div>
                </div>
                <p className="text-xs text-[#5C8374] mt-1">
                  Use at least 8 characters with uppercase and numbers
                </p>
              </div>
            </div>

            {/* Register button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              className="w-full py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center justify-center gap-3 mb-4"
            >
              <Palette className="w-5 h-5" />
              Create Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Login link */}
            <div className="mt-8 pt-6 border-t border-[#5C8374]/20 text-center">
              <p className="text-[#E3FEF7]/70 text-sm mb-3">
                Already have an account?
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-lg hover:bg-[#77B0AA]/10 hover:text-[#9EC8B9] transition-all duration-300"
              >
                Sign in to your account
              </motion.button>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-8 py-4 bg-[#092635]/50 border-t border-[#5C8374]/20">
            <p className="text-xs text-[#5C8374] text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Benefits preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { text: "🎨 Save favorites", color: "#5C8374" },
              { text: "✨ Get updates", color: "#77B0AA" },
              { text: "💝 Support artists", color: "#9EC8B9" },
              { text: "📦 Track orders", color: "#E3FEF7" }
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-xs text-[#E3FEF7]/80 px-2 py-1 rounded bg-[#1B4242]/30"
                style={{ borderLeft: `3px solid ${benefit.color}` }}
              >
                {benefit.text}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#E3FEF7]/60">
            Join thousands of anime art collectors and enthusiasts! ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}