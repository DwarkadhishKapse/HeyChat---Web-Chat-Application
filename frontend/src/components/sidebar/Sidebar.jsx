import React, { useEffect, useState } from "react";
import { getMyChats } from "../../api/chat.api";
import { useAuth } from "../../context/AuthContext";
import { createChat } from "../../api/chat.api";
import UserList from "./UserList";

const Sidebar = ({ selectedChat, onSelectChat }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStartChat = async (user) => {
    const chat = await createChat(user._id);
    onSelectChat(chat);
    setChats((prev) => {
      const exists = prev.find((c) => c._id !== chat._id);
      return exists ? prev : [chat, ...prev];
    });
  };
  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getMyChats();
        setChats(data);
      } catch (error) {
        console.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading chats...</div>;
  }

  return (
    
    <div className="h-full">
      {chats.map((chat) => {
        const otherUser = chat.participants?.find((p) => p._id !== user?._id);

        return (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 cursor-pointer border-b border-gray-800 ${selectedChat?._id === chat._id ? "bg-[#1f1f1f]" : "hover:bg-[#141414]"}`}
          >
            <p className="font-medium">{otherUser?.name || "Unknown User"}</p>
            <p className="text-xs text-gray-400">Click to open chat</p>
          </div>
        );
      })}
      <UserList onSelectUser={handleStartChat} />
    </div>
  );
};

export default Sidebar;
