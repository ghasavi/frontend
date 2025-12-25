import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
// ✅ use your axios instance

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    if (!username || !email || !password)
      return toast.error("All fields are required");

    try {
      await api.post("/users", { username, email, password });
      toast.success("Registration Successful");
      navigate("/login");
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Registration Failed");
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px] px-4"
          />

          <button
            onClick={handleRegister}
            className="w-[300px] h-[50px] bg-[#c3efe9] rounded-[20px] my-[20px] text-[20px] font-bold text-white cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
