import React from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";

const Chat = () => {
  return (
    <ChatLayout
      sidebar={<Sidebar />}
      chat={
        <>
          <ChatHeader />
          <MessageList />
          <ChatInput />
        </>
      }
    />
  );
};

export default Chat;
