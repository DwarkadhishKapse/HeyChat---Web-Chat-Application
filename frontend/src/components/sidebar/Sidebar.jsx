import React, { useEffect, useState } from "react";
import { getMyChats, createChat } from "../../api/chat.api";
import { useAuth } from "../../context/AuthContext";
import UserList from "./UserList";
import socket from "../../socket";

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

  useEffect(() => {
    // increment unread
    socket.on("unread-count-updated", ({ chatId, unreadCount }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                unreadCount: {
                  ...chat.unreadCount,
                  [user._id]: unreadCount,
                },
              }
            : chat,
        ),
      );
    });

    // reset unread
    socket.on("unread-count-reset", ({ chatId }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                unreadCount: {
                  ...chat.unreadCount,
                  [user._id]: 0,
                },
              }
            : chat,
        ),
      );
    });

    return () => {
      socket.off("unread-count-updated");
      socket.off("unread-count-reset");
    };
  }, [user._id, setChats]);

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
      {showUsers && user && <UserList onSelectUser={handleStartChat} />}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser =
            chat.participants.find((p) => p.isAI) ||
            chat.participants.find((p) => String(p._id) !== String(user._id));

          const unread =
            chat.unreadCount?.[user._id] ??
            chat.unreadCount?.get?.(user._id) ??
            0;

          return (
            <div
              key={chat._id}
              onClick={() => {
                // unreadCount (count- disappear) UI reset when Click on chat
                setChats((prev) =>
                  prev.map((c) =>
                    c._id === chat._id
                      ? {
                          ...c,
                          unreadCount: {
                            ...c.unreadCount,
                            [user._id]: 0,
                          },
                        }
                      : c,
                  ),
                );

                onSelectChat(chat);
              }}
              className={`p-4 cursor-pointer border-b border-gray-800 ${
                selectedChat?._id === chat._id
                  ? "bg-[#1f1f1f]"
                  : "hover:bg-[#141414]"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {otherUser.name || "Unknown User"}
                </p>
                {unread > 0 && (
                  <span className="bg-green-500 text-black text-xs px-2 py-0.5 rounded-full">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>
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
