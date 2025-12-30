import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from localStorage (simulate API)
    const storedUser = JSON.parse(localStorage.getItem("mockUser"));
    if (!storedUser) {
      toast.error("No user found. Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    setUser(storedUser);
    setFirstName(storedUser.firstName || "");
    setLastName(storedUser.lastName || "");
    setPreviewImg(storedUser.img || null);
    setLoading(false);
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First & last name are required");
      return;
    }

    const updatedUser = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      img: imgFile ? previewImg : user.img,
    };

    // Save to localStorage (simulate backend)
    localStorage.setItem("mockUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Profile updated!");
    navigate("/profile");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-lg flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          First Name
          <input
            type="text"
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          Last Name
          <input
            type="text"
            className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          Profile Picture
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {previewImg && (
          <img
            src={previewImg}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border-2 border-white mt-2"
          />
        )}

        <button
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
