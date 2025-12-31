import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Camera, Save, ArrowLeft, Sparkles, Palette, Wand2, Check, Image, Shield, Mail } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(UserContext);

  // Pre-made avatars (using your existing paths)
  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png"
  ];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form once user is loaded
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setSelectedAvatar(user.img || avatars[0]);
    }
  }, [user, token]);

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        { 
          username: username.trim(),
          avatar: selectedAvatar,
          bio: bio.trim() || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update context
      setUser(res.data.user);
      
      // Show success message
      setSuccess("Profile updated successfully!");
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-lg text-[#77B0AA] hover:text-[#E3FEF7] hover:border-[#77B0AA] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm rounded-full border border-[#5C8374]/30 mb-4">
              <Sparkles className="w-4 h-4 text-[#E3FEF7]" />
              <span className="text-sm font-medium text-[#E3FEF7]">
                 Customize Your Profile
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Edit Your{" "}
              <span className="bg-gradient-to-r from-[#9EC8B9] via-[#77B0AA] to-[#5C8374] bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-xl text-[#E3FEF7]/80 max-w-2xl mx-auto">
              Personalize your art collector profile and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Current Avatar Preview */}
              <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#77B0AA]" />
                  Profile Picture
                </h3>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] rounded-full blur opacity-30"></div>
                    <img
                      src={selectedAvatar}
                      alt="Selected Avatar"
                      className="relative w-32 h-32 rounded-full border-4 border-[#5C8374] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/defaultUser.png";
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] border-4 border-[#1B4242] flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#77B0AA] text-center">
                    Select an avatar from the options below
                  </p>
                </div>
              </div>

              {/* Avatar Gallery */}
              <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#77B0AA]" />
                  Choose Avatar
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {avatars.map((avatar) => (
                    <motion.button
                      key={avatar}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedAvatar === avatar
                          ? "border-[#5C8374] ring-2 ring-[#77B0AA]/30"
                          : "border-[#5C8374]/30 hover:border-[#77B0AA]"
                      }`}
                    >
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/defaultUser.png";
                        }}
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Main Form Card */}
              <div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <User className="w-6 h-6 text-[#77B0AA]" />
                  Profile Information
                </h3>

                <div className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                      <User className="w-4 h-4 text-[#77B0AA]" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your display name"
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-lg text-[#E3FEF7] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-[#77B0AA] mt-2">
                      This will be your public display name
                    </p>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#E3FEF7]/90 mb-2">
                      <Mail className="w-4 h-4 text-[#77B0AA]" />
                      Email Address
                    </label>
                    <div className="w-full px-4 py-3 bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/20 rounded-lg text-[#E3FEF7]/70">
                      {email}
                    </div>
                    <p className="text-xs text-[#77B0AA] mt-2">
                      Email cannot be changed
                    </p>
                  </div>

                 
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-gradient-to-r from-[#135D66]/20 to-[#003C43]/20 backdrop-blur-sm border border-[#5C8374]/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#135D66] to-[#003C43] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Secure Profile</h4>
                    <p className="text-sm text-[#E3FEF7]/70">
                      Your profile information is securely stored and protected. 
                      Only your display name and avatar are visible to other users.
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 border border-[#5C8374]/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5C8374]" />
                    <p className="text-[#77B0AA] text-sm">{success}</p>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 text-[#77B0AA] font-medium rounded-xl hover:border-[#77B0AA] hover:text-[#E3FEF7] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !username.trim()}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium rounded-xl transition-all duration-200 ${
                    saving || !username.trim()
                      ? 'bg-gradient-to-r from-[#5C8374]/30 to-[#77B0AA]/30 text-[#77B0AA]/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[#5C8374]/30'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}