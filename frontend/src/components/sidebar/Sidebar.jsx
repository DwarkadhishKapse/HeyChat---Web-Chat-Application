import React, { useEffect, useState } from "react";
import { getMyChats, createChat } from "../../api/chat.api";
import { useAuth } from "../../context/AuthContext";
import UserList from "./UserList";

const Sidebar = ({ chats, setChats, selectedChat, onSelectChat }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  const handleStartChat = async (selectedUser) => {
    try {
      const chat = await createChat(selectedUser._id);
      console.log("CHAT CREATED:", chat);

      onSelectChat(chat);

      setChats((prev) => {
        const exists = prev.find((c) => c._id === chat._id);
        return exists ? prev : [chat, ...prev];
      });

      setShowUsers(false);
    } catch (error) {
      console.error("Failed to start chat", error.response?.data || error);
    }
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
    <div className="h-full flex flex-col">
      {/* Start new chat button */}
      <button
        onClick={() => setShowUsers((prev) => !prev)}
        className="p-3 text-sm text-green-400 hover:bg-[#1a1a1a] text-left"
      >
        Start new chat
      </button>

      {/* User list */}
      {showUsers && <UserList onSelectUser={handleStartChat} />}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.participants?.find((p) => p._id !== user?._id);

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-4 cursor-pointer border-b border-gray-800 ${
                selectedChat?._id === chat._id
                  ? "bg-[#1f1f1f]"
                  : "hover:bg-[#141414]"
              }`}
            >
              <p className="font-medium">{otherUser.name || "Unknown User"}</p>
              <p className="text-xs text-gray-400 truncate">
                {chat.lastMessage || "Start a conversation"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
