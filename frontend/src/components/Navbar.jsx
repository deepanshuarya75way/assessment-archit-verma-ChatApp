import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100/70 border-b border-base-content/10 fixed w-full top-0 z-40 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all group">
              <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary/25 via-primary/10 to-transparent flex items-center justify-center border border-primary/20 shadow-md group-hover:scale-105 transition-all duration-300">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-base-content via-base-content/90 to-primary bg-clip-text text-transparent">
                Talkative<span className="text-primary ml-1">🦜</span>
              </h1>
            </Link>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm btn-ghost gap-2 rounded-xl text-xs font-medium hover:bg-base-200/80 transition-all"
            >
              <Settings className="w-4 h-4 text-base-content/70" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm btn-ghost gap-2 rounded-xl text-xs font-medium hover:bg-base-200/80 transition-all"
                >
                  <User className="w-4 h-4 text-base-content/70" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-sm btn-outline border-base-content/20 hover:bg-error/10 hover:text-error hover:border-error/30 gap-2 rounded-xl text-xs font-semibold transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;