import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/productCard";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-20">
      {/* PROFILE INFO */}
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl">
        <div className="flex-shrink-0">
          <img
            src={user.img || "/default-avatar.png"}
            alt="Avatar"
            className="w-40 h-40 rounded-full border-4 border-white object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-zinc-400 text-lg">{user.email}</p>
          {user.bio && <p className="text-zinc-300 mt-2">{user.bio}</p>}
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-zinc-400 text-sm">Role</p>
              <p className="text-white font-semibold">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
  <button
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
    onClick={() => navigate("/editProfile")}
  >
    Edit Profile
  </button>
  <button
    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition"
    onClick={() => {
      localStorage.removeItem("token");
      navigate("/login");
    }}
  >
    Sign Out
  </button>
</div>

    </div>
  );
}
