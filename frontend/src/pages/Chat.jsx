import React from "react";
import ChatLayout from "../components/layout/ChatLayout";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";

const Chat = () => {
  return (
    <ChatLayout
      sidebar={<Sidebar />}
      chat={
        <>
          <ChatHeader />

          <div className="flex-1 flex items-center justify-center text-gray-500">
            Message will appear here
          </div>
        </>
      }
    />
  );
};

export default Chat;
