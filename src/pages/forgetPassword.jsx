import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";


export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function sendOtp() {
    if (!email) return toast.error("Please enter your email");

    api
      .post("/users/send-otp", { email })
      .then((response) => {
        setOtpSent(true);
        toast.success("OTP sent to your email, check your inbox");
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

    const otpInNumberFormat = parseInt(otp, 10);

    api
      .post("/users/reset-password", {
        email,
        otp: otpInNumberFormat,
        newPassword,
      })
      .then((response) => {
        toast.success("OTP verified and password reset successfully");
        console.log(response.data);
        // Redirect to login page after successful reset
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Invalid OTP");
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url('/login.jpg')] bg-center bg-cover">
      {otpSent ? (
        <div className="w-[400px] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col justify-center items-center p-4">
          <input
            type="text"
            placeholder="Enter your OTP"
            className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="w-full h-[50px] bg-accent text-white rounded-lg mb-4 hover:bg-secondary transition-all duration-300"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
          <button
            className="w-full h-[50px] bg-gray-300 text-gray-700 rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300"
            onClick={() => setOtpSent(false)}
          >
            Resend OTP
          </button>
        </div>
      ) : (
        <div className="w-[400px] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col justify-center items-center p-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-[50px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full h-[50px] bg-accent text-white rounded-lg mb-4 hover:bg-secondary transition-all duration-300"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        </div>
      )}
    </div>
  );
}
