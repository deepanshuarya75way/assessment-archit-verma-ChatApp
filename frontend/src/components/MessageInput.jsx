import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const hasContent = text.trim().length > 0 || imagePreview !== null;

  return (
    <div className="p-3 sm:px-6 w-full border-t border-base-content/10 bg-base-100/50 backdrop-blur-md">
      {/* Image Attachment Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-primary/30 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-100 border border-base-content/20 shadow-md text-base-content flex items-center justify-center hover:bg-error hover:text-error-content transition-colors"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-base-200/60 rounded-2xl px-3 py-1.5 border border-base-content/10 focus-within:border-primary/50 focus-within:bg-base-100 transition-all duration-200">
          
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`p-2 rounded-xl hover:bg-base-300/50 transition-colors ${
              imagePreview ? "text-primary font-bold" : "text-base-content/40 hover:text-base-content"
            }`}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Textarea / Input */}
          <input
            type="text"
            className="w-full bg-transparent text-sm text-base-content placeholder:text-base-content/40 focus:outline-none py-1.5"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => socket?.emit("typing", selectedUser?._id)}
            onBlur={() => socket?.emit("stopTyping", selectedUser?._id)}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!hasContent}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 shrink-0 ${
            hasContent
              ? "bg-primary text-primary-content shadow-primary/30 hover:scale-105 active:scale-95"
              : "bg-base-200 text-base-content/30 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;