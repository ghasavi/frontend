import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(UserContext);

  // Pre-made avatars
  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png"
  ];

  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Initialize form once user is loaded
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user) {
      setUsername(user.username || "");
      setSelectedAvatar(user.img || avatars[0]);
    }
  }, [user, token]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        { username, avatar: selectedAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update context and redirect
      setUser(res.data.user);
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center p-6">
      <div className="bg-zinc-800 p-8 rounded-xl w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
        />

        <div className="flex flex-wrap gap-4">
          {avatars.map((a) => (
            <img
              key={a}
              src={a}
              alt="avatar"
              className={`w-20 h-20 rounded-full cursor-pointer border-4 ${
                selectedAvatar === a ? "border-green-500" : "border-gray-500"
              }`}
              onClick={() => setSelectedAvatar(a)}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
