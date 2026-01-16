import React from "react";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
      <MessageBubble
        text="Hey! How can i help you today"
        time="10:30 AM"
        isOwn={false}
      />

      <MessageBubble
        text="Can you explain Socket.IO basics?"
        time="10:31 AM"
        isOwn={true}
      />

      <MessageBubble
        text="Sure! I'll explain you Socket.IO"
        time="10:32 AM"
        isOwn={false}
      />
    </div>
  );
};

export default MessageList;
