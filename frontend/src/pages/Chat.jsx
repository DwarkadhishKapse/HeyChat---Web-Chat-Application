import React, { useState } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";

const Chat = () => {

  // this state used for - select which chat is currently open
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ChatLayout
      sidebar={
        // here onSelectChat (Sidebar) tells Chat which chat was clicked
        <Sidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      }
      chat={
        selectedChat ? (
          <>
            <ChatHeader chat={selectedChat} />
            <MessageList chatId={selectedChat._id} />
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
