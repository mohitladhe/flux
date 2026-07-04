import { Menu, Phone, Search, ShieldCheck, Video } from "lucide-react";
import { messages } from "../data/messaging";
import { Avatar } from "./Avatar";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow({ conversation, onOpenSidebar, onOpenDetails }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col app-chat-surface">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b app-border app-panel px-3 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border app-border app-icon-button transition lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open conversations"
          >
            <Menu size={20} />
          </button>
          <button
            type="button"
            onClick={onOpenDetails}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-2 py-1.5 text-left transition hover:bg-[var(--app-hover)]"
            aria-label="Open conversation details"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                label={conversation.avatar}
                gradient={conversation.accent}
                online={conversation.online}
              />
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold app-text sm:text-lg">
                  {conversation.name}
                </h2>
                <div className="flex items-center gap-1 text-xs font-medium app-success-text">
                  <ShieldCheck size={13} />
                  E2EE verified
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {[Search, Phone, Video].map((Icon, index) => (
                <span
                  key={index}
                  className="hidden size-10 place-items-center rounded-xl app-icon-button sm:grid"
                >
                  <Icon size={19} />
                </span>
              ))}
            </div>
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border app-chip px-4 py-3 text-center text-xs font-semibold">
            <ShieldCheck size={16} className="shrink-0" />
            Key fingerprints match across every active device in this room.
          </div>

          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </div>
      </div>

      <ChatComposer />
    </section>
  );
}
