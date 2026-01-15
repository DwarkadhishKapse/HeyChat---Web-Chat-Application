import React from "react";
import ChatItem from "./ChatItem";

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      <input
        type="text"
        placeholder="Search conversations..."
        className="mb-4 px-3 py-2 rounded-md bg-[#1a1a1a] outline-none text-sm"
      />

      <ChatItem
        name="AI Assistant"
        message="How can i help you today?"
        isAI
        active
      />

      <p className="text-xs text-gray-500 mt-6 mb-2">DIRECT MESSAGES</p>

      <ChatItem name="Sarah Wilson" message="Sounds great!" />
      <ChatItem name="James Cooper" message="I'll send the files tomorrow." />
    </div>
  );
};

export default Sidebar;
