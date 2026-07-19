import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Sparkles, CheckCheck, Image as ImageIcon } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's the new Talkative UI design?", isSent: false, time: "12:00 PM" },
  { id: 2, content: "It looks brilliant! Instant real-time theme switching works smoothly 🚀", isSent: true, time: "12:01 PM" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 pb-12 max-w-5xl font-sans relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-8 relative z-10">
        
        {/* Page Header & Theme Picker Card */}
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-content/10 shadow-2xl p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Appearance Settings</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-base-content via-base-content/90 to-primary bg-clip-text text-transparent">
                Theme Customization
              </h1>
              <p className="text-xs text-base-content/60 font-medium">
                Choose from 30+ curated color palettes for your chat workspace
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-base-200/60 border border-base-content/10 text-xs font-semibold text-base-content/80 self-start sm:self-auto">
              Current: <span className="text-primary capitalize font-bold">{theme}</span>
            </div>
          </div>

          {/* Theme Buttons Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 pt-2">
            {THEMES.map((t) => {
              const isSelected = theme === t;

              return (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-primary/15 border-primary shadow-md shadow-primary/20 scale-[1.03]"
                        : "bg-base-200/40 border-base-content/5 hover:bg-base-200/80 hover:scale-[1.02]"
                    }
                  `}
                  onClick={() => setTheme(t)}
                >
                  <div className="relative h-9 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded-md bg-primary"></div>
                      <div className="rounded-md bg-secondary"></div>
                      <div className="rounded-md bg-accent"></div>
                      <div className="rounded-md bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold truncate w-full text-center text-base-content/80 group-hover:text-base-content">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Section Card */}
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl border border-base-content/10 shadow-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-base-content flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Live Preview
              </h3>
              <p className="text-xs text-base-content/60">
                Experience how messages, headers, and inputs render with the selected theme
              </p>
            </div>
          </div>

          {/* Mock Chat Window */}
          <div className="rounded-2xl border border-base-content/10 overflow-hidden bg-base-100 shadow-xl max-w-xl mx-auto">
            
            {/* Mock Header */}
            <div className="px-4 py-3 border-b border-base-content/10 bg-base-100/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-xs">
                    JD
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-base-100" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-base-content">John Doe</h4>
                  <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Mock Messages Body */}
            <div className="p-4 space-y-4 min-h-[220px] max-h-[220px] overflow-y-auto bg-base-100/40">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col max-w-[80%] ${
                    message.isSent ? "ml-auto items-end text-right" : "mr-auto items-start text-left"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      message.isSent
                        ? "bg-primary text-primary-content rounded-br-xs shadow-primary/20"
                        : "bg-base-200/90 text-base-content rounded-bl-xs border border-base-content/10"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-base-content/50 px-1">
                    <span>{message.time}</span>
                    {message.isSent && <CheckCheck className="w-3 h-3 text-primary" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Input Footer */}
            <div className="p-3 border-t border-base-content/10 bg-base-100/60">
              <div className="flex items-center gap-2 bg-base-200/60 rounded-xl px-3 py-1.5 border border-base-content/10">
                <ImageIcon className="w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                  className="w-full bg-transparent text-xs text-base-content placeholder:text-base-content/40 focus:outline-none"
                  placeholder="This is a live theme preview..."
                  readOnly
                />
                <button className="w-7 h-7 rounded-lg bg-primary text-primary-content flex items-center justify-center shadow-md shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;