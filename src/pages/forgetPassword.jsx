import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Paintbrush, Sparkles, Lock, Mail, Key, ArrowLeft, Shield, RefreshCw, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  function sendOtp() {
    if (!email) return toast.error("Please enter your email");

    api
      .post("/users/send-otp", { email })
      .then((response) => {
        setOtpSent(true);
        toast.success("✅ OTP sent to your email! Check your inbox.");
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to send OTP");
      });
  }

  function verifyOtp() {
    if (!otp || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const otpInNumberFormat = parseInt(otp, 10);

    api
      .post("/users/reset-password", {
        email,
        otp: otpInNumberFormat,
        newPassword,
      })
      .then((response) => {
        toast.success("🎉 Password reset successful! You can now login.");
        console.log(response.data);
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Invalid OTP");
      });
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
        {/* Main card */}
        <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl shadow-2xl shadow-[#003C43]/20 overflow-hidden">
          
          {/* Decorative header */}
          <div className="relative h-32 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#9EC8B9] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#092635]/20 to-transparent"></div>
            <button
              onClick={() => navigate("/login")}
              className="absolute top-4 left-4 p-2 rounded-lg bg-[#092635]/30 backdrop-blur-sm border border-[#E3FEF7]/20 hover:bg-[#092635]/50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-[#E3FEF7]" />
            </button>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#092635]/30 backdrop-blur-sm border border-[#E3FEF7]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#E3FEF7]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E3FEF7]">
                  {otpSent ? "Reset Password" : "Forgot Password"}
                </h1>
                <p className="text-sm text-[#E3FEF7]/80">
                  {otpSent ? "Enter OTP & new password" : "Recover your account"}
                </p>
              </div>
            </div>
            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-[#E3FEF7]" />
          </div>

          {/* Form content */}
          <div className="p-8">
            {!otpSent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Email input */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                    <Mail className="w-4 h-4 text-[#77B0AA]" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-[#5C8374] mt-2">
                    We'll send a 6-digit OTP to this email
                  </p>
                </div>

                {/* Send OTP button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendOtp}
                  className="w-full py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-[#092635] font-bold rounded-lg hover:shadow-lg hover:shadow-[#5C8374]/30 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Key className="w-5 h-5" />
                  Send OTP
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* OTP input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                    <Shield className="w-4 h-4 text-[#77B0AA]" />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-[#5C8374] mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Sent to: {email}
                  </p>
                </div>

                {/* New Password input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                    <Lock className="w-4 h-4 text-[#77B0AA]" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a new password"
                      className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C8374] hover:text-[#9EC8B9] transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                    <Lock className="w-4 h-4 text-[#77B0AA]" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-3 bg-[#092635]/50 border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C8374] hover:text-[#9EC8B9] transition-colors"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Password match indicator */}
                {newPassword && confirmPassword && (
                  <div className={`text-sm p-3 rounded-lg ${newPassword === confirmPassword ? 'bg-[#5C8374]/20 text-[#9EC8B9]' : 'bg-[#135D66]/20 text-[#77B0AA]'}`}>
                    {newPassword === confirmPassword ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Passwords match
                      </div>
                    ) : (
                      "Passwords do not match"
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={verifyOtp}
                    disabled={newPassword !== confirmPassword || !otp || otp.length !== 6}
                    className={`w-full py-3 ${newPassword === confirmPassword && otp && otp.length === 6 ? 'bg-gradient-to-r from-[#5C8374] to-[#77B0AA]' : 'bg-[#5C8374]/30'} text-[#092635] font-bold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Reset Password
                  </motion.button>

                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full py-3 bg-transparent border border-[#77B0AA] text-[#77B0AA] font-medium rounded-lg hover:bg-[#77B0AA]/10 hover:text-[#9EC8B9] transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Resend OTP
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Back to login */}
            <div className="mt-8 pt-6 border-t border-[#5C8374]/20 text-center">
              <p className="text-[#E3FEF7]/70 text-sm mb-3">
                Remember your password?
              </p>
              <button
                onClick={() => navigate("/login")}
                className="text-[#77B0AA] hover:text-[#9EC8B9] hover:underline transition-colors text-sm font-medium"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-8 py-4 bg-[#092635]/50 border-t border-[#5C8374]/20">
            <p className="text-xs text-[#5C8374] text-center">
              Secure password reset process • Your data is protected
            </p>
          </div>
        </div>

        {/* Security info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#E3FEF7]/60 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your account security is our top priority
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}