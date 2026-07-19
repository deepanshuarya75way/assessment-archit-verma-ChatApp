import { X, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import avatarLogo from "../assets/Avatar_Logo.jpg";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <div className="p-3 sm:px-6 border-b border-base-content/10 bg-base-100/60 backdrop-blur-md">
      <div className="flex items-center justify-between">
        
        {/* User Info Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser?.profilePic || avatarLogo}
              alt={selectedUser?.fullName}
              className="w-10 h-10 object-cover rounded-full border border-base-content/10"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-base-100" />
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-base-content">{selectedUser?.fullName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isTyping ? (
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Typing...
                </span>
              ) : (
                <span className="text-[11px] opacity-60 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-base-content/30"}`} />
                  {isOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="w-8 h-8 rounded-xl bg-base-200/50 hover:bg-error/10 hover:text-error text-base-content/60 flex items-center justify-center transition-all duration-200"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;