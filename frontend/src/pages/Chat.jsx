import React, { useState } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";

const Chat = () => {
  // this state used for - select which chat is currently open
  const [selectedChat, setSelectedChat] = useState(null);

  // --------------------------------------------------
  /* last message show in sidebar. so, flow is this- 
    Chat.jsx own chats state and tell MessageList "If you received any new message tell me using onNewMessage(), 
    I'll update and send last message to Sidebar using props and Sidebar will update it" 
  */
  const [chats, setChats] = useState([]);

  const handleNewMessage = (chatId, lastMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId
          ? { ...chat, lastMessage, lastMessageAt: new Date() }
          : chat,
      ),
    );
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
            <ChatHeader chat={selectedChat} />
            <MessageList
              chatId={selectedChat._id}
              onNewMessage={handleNewMessage}
            />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging
          </div>
        )
      }
    />
  );
};

export default Chat;
