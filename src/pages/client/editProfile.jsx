import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        setName(`${data.firstName} ${data.lastName}`);
        setPreview(data.img || "/default-avatar.png");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    }

    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      console.log("Profile updated:", data);
      navigate("/profile"); // go back to profile page
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-20 flex justify-center">
      <div className="bg-zinc-800 p-10 rounded-xl w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <div className="flex flex-col items-center gap-4">
          <img src={preview} alt="Avatar" className="w-32 h-32 rounded-full border-2 border-white object-cover" />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-zinc-400">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded bg-zinc-700 text-white"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
