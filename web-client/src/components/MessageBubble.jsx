import { motion } from "framer-motion";
import { CheckCheck, LoaderCircle, AlertCircle } from "lucide-react";
import { Avatar } from "./Avatar";
import { useAuthStore } from "../store/authStore";
import { formatMessageTime } from "../utils/formatMessageTime";
import { useChatStore } from "../store/chatStore";

export function MessageBubble({ message }) {
  const user = useAuthStore((state) => state.user);
  const isMine = String(message.sender?._id) === String(user?._id);
  let senderUsername = "@" + message.sender?.username;
  const formattedTime = formatMessageTime(message.createdAt);
  const activeConversation = useChatStore((state) => state.activeConversation);
  return (
    <motion.div
      className={`flex gap-3 ${isMine ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      {!isMine && (
        <Avatar label={message.sender?.avatar} gradient="avatar-neutral" size="sm" />
      )}

      <div
        className={`max-w-[min(34rem,82%)] ${isMine ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-2.5 py-1.5 ${
            isMine
              ? "rounded-br-sm app-own-bubble"
              : "rounded-bl-sm border app-other-bubble"
          }`}
        >
          {!isMine && activeConversation.type === "group" && (
            <p className="mb-1 text-xs font-bold app-accent-text">
              {message.sender.name ?? senderUsername}
            </p>
          )}
          <p className="flex text-sm leading-6">{message.content}</p>
          <div
            className={`-mt-1 flex items-center gap-2 text-[0.72rem] ${
              isMine ? "justify-end app-faint -me-0.5" : "app-muted"
            }`}
          >
            <span>{message.edited && Edited}</span>
            <span className="app-">{formattedTime}</span>
            {isMine && (
              <span>
                {message.status === "sending" && (
                  <LoaderCircle size={14} className="app-accent-text" />
                )}{" "}
                {message.status === "sent" && (
                  <CheckCheck size={14} className="app-accent-text" />
                )}{" "}
                {message.status === "failed" && (
                  <AlertCircle size={14} className="text-red-500" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
