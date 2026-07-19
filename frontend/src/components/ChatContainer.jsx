import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck, Sparkles, MessageSquare } from "lucide-react";

import avatarLogo from "../assets/Avatar_Logo.jpg";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      subscribeToTyping();
    }
    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages, subscribeToTyping, unsubscribeFromTyping]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-base-100/40">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100/40 relative overflow-hidden">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-base-content">
                Start a conversation
              </h4>
              <p className="text-xs text-base-content/60 max-w-xs">
                Say hello to <span className="font-semibold text-primary">{selectedUser.fullName}</span> to break the ice!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isSentByMe = message.senderId === authUser._id;

            return (
              <div
                key={message._id}
                ref={messageEndRef}
                className={`flex gap-3 max-w-[85%] sm:max-w-[70%] transition-all duration-200 ${
                  isSentByMe ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* User Avatar */}
                <div className="shrink-0 self-end mb-1">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || avatarLogo
                        : selectedUser.profilePic || avatarLogo
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-base-content/10 shadow-sm"
                  />
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`flex flex-col ${
                    isSentByMe ? "items-end text-right" : "items-start text-left"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed max-w-full break-words ${
                      isSentByMe
                        ? "bg-primary text-primary-content rounded-br-xs shadow-primary/20"
                        : "bg-base-200/90 text-base-content rounded-bl-xs border border-base-content/10"
                    }`}
                  >
                    {/* Attachment Image if present */}
                    {message.image && (
                      <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-h-60 w-full object-cover hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    )}

                    {/* Text Message */}
                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                  </div>

                  {/* Timestamp & Delivery Info */}
                  <div
                    className={`flex items-center gap-1.5 mt-1 px-1 text-[10px] font-medium text-base-content/50`}
                  >
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isSentByMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Footer */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;