import React from "react";
import { useAuth } from "../../context/AuthContext";

const ChatHeader = ({ chat }) => {
  const { user } = useAuth();

  if (!chat) return null;

  const otherUser = chat.participants.find((p) => p._id !== user._id);

  const initials = otherUser?.name
    ?.split(" ")
    .map((word) => word[0] + word[1])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f]">
      <div className="flex items-center gap-3">
        <div className="w-10  h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
          {initials || "?"}
        </div>

        <div>
          <p className="font-medium text-sm">{otherUser?.name || "Chat"}</p>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>
      <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
    </div>
  );
};

export default ChatHeader;
