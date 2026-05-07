import { motion } from "framer-motion";
import { CheckCheck, KeyRound } from "lucide-react";
import { Avatar } from "./Avatar";

export function MessageBubble({ message, index }) {
  return (
    <motion.div
      className={`flex gap-3 ${message.mine ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      {!message.mine && <Avatar label={message.avatar} gradient="avatar-neutral" size="sm" />}

      <div className={`max-w-[min(34rem,82%)] ${message.mine ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-[1.35rem] px-4 py-3 ${
            message.mine
              ? "rounded-br-md app-own-bubble"
              : "rounded-bl-md border app-other-bubble"
          }`}
        >
          {!message.mine && <p className="mb-1 text-xs font-bold app-accent-text">{message.author}</p>}
          <p className="text-sm leading-6">{message.body}</p>
        </div>

        <div
          className={`mt-2 flex items-center gap-2 text-[0.72rem] ${
            message.mine ? "justify-end app-faint" : "app-muted"
          }`}
        >
          <span>{message.time}</span>
          <span className="inline-flex items-center gap-1">
            <KeyRound size={12} />
            {message.state}
          </span>
          {message.mine && <CheckCheck size={14} className="app-accent-text" />}
        </div>
      </div>
    </motion.div>
  );
}
