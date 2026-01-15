import React from "react";

const ChatHeader = () => {
  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f]">
      <div className="flex items-center gap-3">
        <div className="w-10  h-10 bg-green-700 rounded-full flex items-center justify-center font-bold">
          AI
        </div>

        <div>
          <p className="font-medium text-sm">AI Assistant</p>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>
      <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
    </div>
  );
};

export default ChatHeader;
