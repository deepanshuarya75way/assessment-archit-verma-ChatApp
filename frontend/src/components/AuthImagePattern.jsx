import React from "react";
import { MessageSquare, ShieldCheck, Zap, Users, Sparkles } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200/50 p-12 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        {/* Interactive Feature Grid / Floating Cards */}
        <div className="relative p-6 rounded-3xl bg-base-100/60 backdrop-blur-xl border border-base-content/10 shadow-2xl space-y-4">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Next-Gen Realtime Messaging</span>
          </div>

          {/* Interactive Chat Preview Showcase */}
          <div className="space-y-3 pt-2">
            {/* Message 1 - Received */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-base-200/70 border border-base-content/5 shadow-sm text-left transition-transform hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Alex Rivera</span>
                  <span className="text-[10px] opacity-50">Just now</span>
                </div>
                <p className="text-xs text-base-content/80 mt-0.5">
                  Hey! The new 21st UI features look amazing 🚀
                </p>
              </div>
            </div>

            {/* Message 2 - Sent */}
            <div className="flex items-start justify-end gap-3 p-3 rounded-2xl bg-primary text-primary-content shadow-md text-right ml-6 transition-transform hover:-translate-y-0.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] opacity-75">12:42 PM</span>
                  <span className="text-xs font-semibold">You</span>
                </div>
                <p className="text-xs mt-0.5 font-medium">
                  Instant real-time chat with Socket.IO! ⚡
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-content/20 flex items-center justify-center font-bold text-xs shrink-0">
                ME
              </div>
            </div>
          </div>

          {/* Feature Badges Row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-base-content/10">
            <div className="flex flex-col items-center p-2 rounded-xl bg-base-200/50 text-center">
              <Zap className="w-4 h-4 text-warning mb-1" />
              <span className="text-[11px] font-medium opacity-80">Instant</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-base-200/50 text-center">
              <ShieldCheck className="w-4 h-4 text-success mb-1" />
              <span className="text-[11px] font-medium opacity-80">Secure</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-base-200/50 text-center">
              <Users className="w-4 h-4 text-info mb-1" />
              <span className="text-[11px] font-medium opacity-80">Live Status</span>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-base-content via-base-content/90 to-primary bg-clip-text text-transparent mb-2">
            {title}
          </h2>
          <p className="text-sm text-base-content/70 leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;