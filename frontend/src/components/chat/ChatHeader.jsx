import React from "react";
import { useAuth } from "../../context/AuthContext";
import heyAIAvatar from "../../assets/heyai.png"

const ChatHeader = ({ chat, onlineUsers }) => {
  const { user } = useAuth();

  if (!chat) return null;

  const otherUser = chat.participants.find((p) => p._id !== user._id);

  const isOnline = otherUser.isAI ? true : onlineUsers.includes(otherUser._id);

  const initials = otherUser?.name
    ?.split(" ")
    .map((word) => word[0] + word[1])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f]">
      <div className="flex items-center gap-3">
        {otherUser.isAI ? (
          <img src={heyAIAvatar} alt="HeyAI" className="w-10 h-10 rounded-full object-cover"/>
        ): (
          <div className="w-10  h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
          {initials || "?"}
        </div>
        )}

        <div>
          <p className="font-medium text-sm">{otherUser?.name || "Chat"}</p>
          <p className={isOnline ? "text-xs text-green-400" : "text-gray-400"}>
            {otherUser.isAI? "Online" : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
    </div>
  );
};

export default ChatHeader;
