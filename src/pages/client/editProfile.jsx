import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");

    if (user) {
      setUsername(user.username);
      setPreview(user.img || "/defaultUser.png");
      setLoading(false);
    } else {
      async function fetchUser() {
        try {
          const res = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();
          setUsername(data.username);
          setPreview(data.img || "/defaultUser.png");
          setUser(data); // set context
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to load profile. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
      fetchUser();
    }
  }, [token, navigate, user, setUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    // update context so header shows preview instantly
    setUser({ ...user, img: previewURL });
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("username", username);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      const data = await res.json();

      // update context with backend returned URL
      setUser(data);

      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-20 flex justify-center">
      <div className="bg-zinc-800 p-10 rounded-xl w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <div className="flex flex-col items-center gap-4">
          <img
            src={preview || "/defaultUser.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-2 border-white object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/defaultUser.png";
            }}
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white"
        />

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
