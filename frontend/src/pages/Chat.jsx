import React, { useState } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import { getMyChats } from "../api/chat.api";
import { useEffect } from "react";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user, loading } = useAuth();

  // this state used for - select which chat is currently open
  const [selectedChat, setSelectedChat] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  // --------------------------------------------------
  /* last message show in sidebar. so, flow is this- 
    Chat.jsx own chats state and tell MessageList "If you received any new message tell me using onNewMessage(), 
    I'll update and send last message to Sidebar using props and Sidebar will update it" 
  */
  const [chats, setChats] = useState([]);

  // --------------------------------------------------
  // Loads chat when chat page opens
  useEffect(() => {
    if (!user || loading) return;

    const fetchChats = async () => {
      try {
        const data = await getMyChats();
        setChats(data);
      } catch (error) {
        console.error("Failed to load chats", error);
      }
    };

    fetchChats();
  }, [user, loading]);

  useEffect(() => {
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online-users");
  }, []);

  const handleNewMessage = (chatId, lastMessage) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        String(chat._id) === String(chatId)
          ? { ...chat, lastMessage, lastMessageAt: new Date() }
          : chat,
      );

      // move updated chat to top
      return updatedChats.sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
      );
    });
  };

  // -----------------------------------------------------

  return (
    <ChatLayout
      sidebar={
        // here onSelectChat (Sidebar) tells Chat which chat was clicked
        <Sidebar
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      }
      chat={
        selectedChat ? (
          <>
            <ChatHeader chat={selectedChat} onlineUsers={onlineUsers} />
            <MessageList
              chatId={selectedChat._id}
              onNewMessage={handleNewMessage}
            />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-200 text-xl">
            Select a chat to start messaging
          </div>
        )
      }
    />
  );
};

export default Chat;
