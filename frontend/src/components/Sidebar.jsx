import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Circle } from "lucide-react";
import AvatarLogo from "../assets/Avatar_Logo.jpg";
import { useGroupStore } from "../store/useGroupStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {groups}= useGroupStore()

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Calculate actual online contacts excluding the logged in user
  const activeOnlineCount = Math.max(0, onlineUsers.filter((id) => id !== authUser?._id).length);

  const filteredUsers = users.filter((user) => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 flex flex-col transition-all duration-300 bg-base-100/50 backdrop-blur-md">
      
      {/* Header & Controls */}
      <div className="border-b border-base-content/10 w-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base-content">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm hidden lg:block">Contacts</span>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full hidden lg:inline-block">
            {users.length}
          </span>
        </div>

        {/* Contact Search Input */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-base-200/60 text-xs rounded-xl pl-9 pr-3 py-2 border border-base-content/10 focus:border-primary focus:bg-base-100 focus:outline-none transition-all"
          />
        </div>

        {/* Online Toggle */}
        <div className="hidden lg:flex items-center justify-between pt-1">
          <label className="cursor-pointer flex items-center gap-2 text-xs text-base-content/70 select-none">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded-md"
            />
            <span>Show online only</span>
          </label>
          <span className="text-[11px] font-medium text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            {activeOnlineCount} online
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-2 flex-1 space-y-1 px-2">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 group
                ${
                  isSelected
                    ? "bg-primary/15 text-primary font-semibold border border-primary/20 shadow-sm"
                    : "hover:bg-base-200/70 text-base-content/80"
                }
              `}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0 shrink-0">
                <img
                  src={user.profilePic || AvatarLogo}
                  alt={user.fullName}
                  className="w-11 h-11 object-cover rounded-full border border-base-content/10"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              {/* User Info (Desktop) */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                  {user.fullName}
                </div>
                <div className="text-[11px] opacity-60 flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-base-content/30"}`} />
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-xs text-base-content/50 py-8 space-y-1">
            <p className="font-medium">No contacts found</p>
            {showOnlineOnly && <p className="text-[10px]">Try unchecking 'Show online only'</p>}
          </div>
        )}
      </div>

     {groups?.length>0 && (
      <div className="mt-4">
        <h3 className="px-4 py-2 text-sm">Groups</h3>
        {groups.map((group)=>(
          <div key={group._id} className="flex cursor-pointer items-center gap-3 px-4 py-3 ">
            <div className="flex h-10 w-10 items-center justify-center">
              {group.name?.charAt(0).toUpperCase()}
            </div>
            <div className="">
              <p>
                {group.name}
              </p>
              <p>
                {group.members?.length ||0} members
              </p>

            </div>
          </div>
          
          
        ))}
      </div>
     )}
    </aside>
  );
};
export default Sidebar;
