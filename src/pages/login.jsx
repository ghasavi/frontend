import { useGoogleLogin } from "@react-oauth/google";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import jwt_decode from "jwt-decode"; 
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

        toast.success("Login Successful");
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

      toast.success("Login Successful");
      decoded.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[20px] px-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-4"
          />
          <button
            onClick={handleLogin}
            className="w-[300px] h-[50px] bg-[#c3efe9] rounded-[20px] my-[20px] text-[20px] font-bold text-white cursor-pointer hover:opacity-90 transition"
          >
            Login
          </button>
          <button
            onClick={googleLogin}
            className="w-[300px] h-[50px] flex justify-center items-center bg-[#c3efe9] rounded-[20px] my-[20px] text-[20px] font-bold text-white cursor-pointer hover:opacity-90 transition"
          >
            <GrGoogle className="text-xl text-gray-600 mr-2" />
            <span className="text-gray-600 text-xl font-semibold">Login with Google</span>
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-[300px] h-[50px] bg-transparent border border-[#c3efe9] rounded-[20px] my-[10px] text-[18px] font-semibold text-[#c3efe9] hover:bg-[#c3efe9] hover:text-white transition duration-200 cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
