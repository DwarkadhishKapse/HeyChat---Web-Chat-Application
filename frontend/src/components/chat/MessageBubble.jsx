import React from "react";

const MessageBubble = ({
  message,
  time,
  isOwn,
  delivered,
  seen,
  omImageClick,
  onVideoClick,
}) => {
  const { messageType, content, fileUrl, fileName, fileSize } = message;
  let status = "✓";

  if (seen) {
    status = "👀";
  } else if (delivered) {
    status = "✓✓";
  }

  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-mb mb-2 mr-3
        ${
          isOwn
            ? "ml-auto bg-green-600 text-white rounded-br-none"
            : "mr-auto bg-[#1f1f1f] text-white rounded-bl-none"
        }`}
    >
      {/* text message */}
      {messageType === "text" && <p className="break-word">{content}</p>}

      {/* image message */}
      {messageType === "image" && (
        <img
          src={`http://localhost:5000${fileUrl}`}
          alt="image"
          onClick={() => omImageClick(`http://localhost:5000${fileUrl}`)}
          className="rounded-lg max-h-60 cursor-pointer hover:opacity-90"
        />
      )}

      {/* Video message */}
      {messageType === "video" && (
        <video
          src={`http://localhost:5000${fileUrl}`}
          controls
          className="rounded-lg max-h-60"
          onClick={() => onVideoClick(`http://localhost:5000${fileUrl}`)}
        />
      )}

      {/* file message */}
      {messageType === "file" && (
        <a
          href={`http://localhost:5000${fileUrl}`}
          download
          className="flex items-center gap-2 bg-black/20 p-2 rounded-lg"
        >
          <span className="text-xl">📎</span>
          <div className="max-w-45">
            <p className="text-sm truncate">{fileName}</p>
            <p className="text-[10px] opacity-60">
              {(fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </a>
      )}

      {/* time and status */}
      <div className="flex justify-end items-center gap-1 mt-1">
        <p className="text-[10px] opacity-60">{time}</p>

        {isOwn && (
          <span key={status} className="text-[10px] opacity-70 tick-animate">
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
