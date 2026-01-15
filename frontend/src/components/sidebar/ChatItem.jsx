import React from "react";

const ChatItem = ({ name, message, isAI, active }) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1 ${
        active ? "bg-[#1f1f1f]" : "hover:bg-[#1a1a1a]"
      }`}
    >
      {/* avatar */}
      <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center font-bold">
        {isAI ? "AI" : name[0]}
      </div>

      {/* text */}
      <div className="flex-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-400 truncate">{message}</p>
      </div>
    </div>
  );
};

export default ChatItem;
