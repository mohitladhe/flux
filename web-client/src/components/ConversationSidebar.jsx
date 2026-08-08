import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Archive, Plus, Search, Settings } from "lucide-react";
import { Avatar } from "./Avatar";
import { NewChatOverlay } from "./NewChatOverlay";
import { conversations, currentUser } from "../data/messaging";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { formatConversationTime } from "../utils/formatConversationTime";

export function ConversationSidebar({
  activeId,
  onSelectConversation,
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const [newChatOpen, setNewChatOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const conversationList = useChatStore((state) => state.conversationList);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            className="fixed inset-0 z-30 bg-stone-900/30 backdrop-blur-sm lg:hidden"
            aria-label="Close conversations"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[21rem] max-w-[88vw] flex-col border-r app-border app-panel transition-transform duration-300 lg:static lg:z-auto lg:w-[22rem] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b app-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl">
                <img
                  src="/flux_logo.png"
                  alt="Flux Logo"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold app-text">Flux</h1>
                <p className="text-xs font-medium app-muted">
                  Encrypted messenger
                </p>
              </div>
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl border app-border app-icon-button transition"
              aria-label="Open settings"
            >
              <Settings size={19} />
            </button>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm app-input-shell">
            <Search size={18} />
            <input
              className="w-full bg-transparent outline-none app-input"
              placeholder="Search chats, people, keys"
              aria-label="Search conversations"
            />
          </label>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] app-faint">
            Inbox
          </p>
          <button
            type="button"
            onClick={() => setNewChatOpen(true)}
            className="grid size-9 place-items-center rounded-xl transition app-accent-button"
            aria-label="Start new chat"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {conversationList.map((conversation) => {
            const active = conversation._id === activeId;

            return (
              <button
                key={conversation._id}
                type="button"
                onClick={() => {
                  onSelectConversation(conversation);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition ${
                  active
                    ? "app-selected"
                    : "app-text hover:bg-[var(--app-hover)]"
                }`}
              >
                <Avatar
                  label={conversation.display.avatar}
                  // gradient={conversation.accent}
                  online={conversation.display.isOnline}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">
                      {conversation.display.name}
                    </p>
                    <span
                      className={`text-xs ${active ? "app-selected-muted" : "app-faint"}`}
                    >
                      {formatConversationTime(conversation.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <p
                      className={`truncate text-xs ${active ? "app-selected-muted" : "app-muted"}`}
                    >
                      {conversation.type === "group" && (conversation.lastMessage?.senderName + ": ")}
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                </div>
                {/* {conversation.unread > 0 && (
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                      active ? "app-accent-button" : "app-unread"
                    }`}
                  >
                    {conversation.unread}
                  </span>
                )} */}
              </button>
            );
          })}
        </div>

        <div className="border-t app-border p-4">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition app-ghost-button">
              <Archive size={17} />
              Archive
            </button>
            <button
              type="button"
              onClick={() => setNewChatOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition app-ghost-button"
            >
              <Plus size={17} />
              New Chat
            </button>
          </div>
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 rounded-2xl app-panel-muted p-3 transition app-ghost-button cursor-pointer"
          >
            <Avatar
              label={currentUser.avatar}
              gradient="avatar-neutral"
              online
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold app-text">
                {currentUser.name}
              </p>
              <p className="text-xs app-success-text">{currentUser.status}</p>
            </div>
          </div>
        </div>
      </aside>

      <NewChatOverlay
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
      />
    </>
  );
}
