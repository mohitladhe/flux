import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Paperclip, Send, SmilePlus } from "lucide-react";
import { attachments } from "../data/messaging";

export function ChatComposer() {
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  return (
    <div className="border-t app-border app-panel p-3 sm:p-4">
      <AnimatePresence initial={false}>
        {attachmentsOpen && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="mb-3 grid gap-2 sm:flex">
              {attachments.map(({ icon: Icon, label, hint }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition app-ghost-button"
                >
                  <Icon size={16} className="app-accent-text" />
                  <span>
                    <span className="block text-xs font-bold app-text">{label}</span>
                    <span className="block text-[0.68rem] app-faint">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 rounded-[1.5rem] border p-2 app-input-shell">
        <button
          type="button"
          className={`grid size-11 shrink-0 place-items-center rounded-2xl transition ${
            attachmentsOpen ? "app-selected" : "app-icon-button"
          }`}
          onClick={() => setAttachmentsOpen((open) => !open)}
          aria-expanded={attachmentsOpen}
          aria-label="Attach encrypted file"
        >
          <Paperclip size={20} />
        </button>
        <textarea
          rows="1"
          aria-label="Message"
          placeholder="Message"
          className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm leading-5 outline-none app-input"
        />
        <button
          type="button"
          className="hidden size-11 shrink-0 place-items-center rounded-2xl transition app-icon-button sm:grid"
          aria-label="Add reaction"
        >
          <SmilePlus size={20} />
        </button>
        <motion.button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-2xl app-accent-button"
          aria-label="Send message"
          whileTap={{ scale: 0.94 }}
        >
          <Send size={19} />
        </motion.button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium app-faint">
        <LockKeyhole size={14} className="app-success-text" />
        Messages are encrypted on this device before delivery.
      </div>
    </div>
  );
}
