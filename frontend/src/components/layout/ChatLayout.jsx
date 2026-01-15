import React from "react";

const ChatLayout = ({ sidebar, chat }) => {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[320px] bg-[#0f0f0f] border-r border-gray-800">
        {sidebar}
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-black flex flex-col">{chat}</div>
    </div>
  );
};

export default ChatLayout;
