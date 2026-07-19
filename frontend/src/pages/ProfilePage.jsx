import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const formattedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen pt-20 pb-12 bg-base-200/50 flex items-center justify-center font-sans relative overflow-hidden px-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-content/10 shadow-2xl p-6 sm:p-8 space-y-7">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Profile</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-base-content via-base-content/90 to-primary bg-clip-text text-transparent">
              Account Overview
            </h1>
            <p className="text-xs text-base-content/60 font-medium">
              Manage your personal information and profile picture
            </p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl relative bg-base-200">
                <img
                  src={
                    selectedImg ||
                    authUser?.profilePic ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Upload Button */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-1 right-1 
                  bg-primary text-primary-content hover:scale-110 active:scale-95
                  p-2.5 rounded-full cursor-pointer 
                  shadow-lg shadow-primary/30 border-2 border-base-100
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-80" : ""}
                `}
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            
            <p className="text-xs font-medium text-base-content/60">
              {isUpdatingProfile ? (
                <span className="text-primary font-semibold animate-pulse">Uploading photo...</span>
              ) : (
                "Click the camera icon to update your photo"
              )}
            </p>
          </div>

          {/* User Fields */}
          <div className="space-y-4 pt-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                Full Name
              </label>
              <div className="px-4 py-3 bg-base-200/60 rounded-xl border border-base-content/10 font-semibold text-sm text-base-content flex items-center justify-between">
                <span>{authUser?.fullName}</span>
                <CheckCircle2 className="w-4 h-4 text-success opacity-80" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                Email Address
              </label>
              <div className="px-4 py-3 bg-base-200/60 rounded-xl border border-base-content/10 font-semibold text-sm text-base-content flex items-center justify-between">
                <span>{authUser?.email}</span>
                <CheckCircle2 className="w-4 h-4 text-success opacity-80" />
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-base-200/40 rounded-2xl p-5 border border-base-content/10 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Account Details
            </h2>
            
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between py-1.5 border-b border-base-content/10">
                <span className="text-base-content/60 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member Since
                </span>
                <span className="font-semibold text-base-content">{formattedDate}</span>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-base-content/10">
                <span className="text-base-content/60">Account Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base-content/60">Security</span>
                <span className="text-emerald-500 font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;