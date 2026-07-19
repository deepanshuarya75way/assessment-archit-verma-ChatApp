import { MessageSquare, Sparkles, Shield, Zap, Image as ImageIcon } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-base-100/40 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        
        {/* Animated Brand Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse" />
            <div className="w-20 h-20 rounded-2xl bg-base-100 border border-primary/20 flex items-center justify-center shadow-xl relative">
              <MessageSquare className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        {/* Welcome Heading & Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Connect</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-base-content via-base-content/90 to-primary bg-clip-text text-transparent">
            Welcome to Talkative🦜
          </h2>
          <p className="text-sm text-base-content/60 leading-relaxed max-w-sm mx-auto">
            Select a contact from the sidebar to start a real-time conversation or share photos.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-base-200/50 border border-base-content/5 shadow-sm">
            <Zap className="w-4 h-4 text-warning mb-1.5" />
            <span className="text-xs font-semibold">Realtime</span>
            <span className="text-[10px] text-base-content/50">Instant delivery</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-base-200/50 border border-base-content/5 shadow-sm">
            <Shield className="w-4 h-4 text-success mb-1.5" />
            <span className="text-xs font-semibold">Encrypted</span>
            <span className="text-[10px] text-base-content/50">Private sessions</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-2xl bg-base-200/50 border border-base-content/5 shadow-sm">
            <ImageIcon className="w-4 h-4 text-info mb-1.5" />
            <span className="text-xs font-semibold">Media</span>
            <span className="text-[10px] text-base-content/50">Photo sharing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;