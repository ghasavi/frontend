import { useGoogleLogin } from "@react-oauth/google";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import jwt_decode from "jwt-decode"; 
import { UserContext } from "../context/UserContext";
import { Paintbrush, Sparkles, Palette, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleToken = (token) => {
    const decoded = jwt_decode(token);
    login(token, decoded);
    return decoded;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await api.post("/users/login/google", { accessToken: response.access_token });
        const decoded = handleToken(res.data.token);

        if (decoded.isBlock) return toast.error("Your account is blocked.");

        toast.success("Welcome back to Pixaku! 🎨");
        decoded.role === "admin" ? navigate("/admin") : navigate("/");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please enter email and password");

    try {
      const res = await api.post("/users/login", { email, password });
      const decoded = handleToken(res.data.token);

      if (decoded.isBlock) return toast.error("Your account is blocked.");

      toast.success("Welcome back to Pixaku! 🎨");
      decoded.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating color blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        
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
        {/* Login card */}
        <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl shadow-2xl shadow-[#003C43]/20 overflow-hidden">
          
          {/* Decorative header */}
          <div className="relative h-32 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#9EC8B9] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/20 to-transparent"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#092635]/30 backdrop-blur-sm border border-[#E3FEF7]/20 flex items-center justify-center">
                <Paintbrush className="w-6 h-6 text-[#E3FEF7]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E3FEF7]">Welcome Back</h1>
                <p className="text-sm text-[#E3FEF7]/80">Sign in to Pixaku</p>
              </div>
            </div>
            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-[#E3FEF7]" />
          </div>

          {/* Form content */}
          <div className="p-8">
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
                  placeholder="••••••••"
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
              <button
                onClick={() => navigate("/forgotPassword")}
                className="text-sm text-[#77B0AA] hover:text-[#9EC8B9] hover:underline mt-2 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center justify-center gap-3 mb-4"
            >
              <Palette className="w-5 h-5" />
              Sign In
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"></div>
              <span className="px-4 text-sm text-[#5C8374]">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"></div>
            </div>

            {/* Google login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={googleLogin}
              className="w-full py-3 bg-[#092635]/50 border border-[#5C8374]/30 text-[#E3FEF7] font-medium rounded-lg hover:bg-[#092635]/80 hover:border-[#77B0AA]/50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <GrGoogle className="w-5 h-5" />
              Sign in with Google
            </motion.button>

            {/* Register link */}
            <div className="mt-8 pt-6 border-t border-[#5C8374]/20 text-center">
              <p className="text-[#E3FEF7]/70 text-sm mb-3">
                New to Pixaku?
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/register")}
                className="w-full py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-lg hover:bg-[#77B0AA]/10 hover:text-[#9EC8B9] transition-all duration-300"
              >
                Create an account
              </motion.button>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-8 py-4 bg-[#092635]/50 border-t border-[#5C8374]/20">
            <p className="text-xs text-[#5C8374] text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Art preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#E3FEF7]/60">
            Explore thousands of hand-drawn anime artworks once you're signed in! ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}