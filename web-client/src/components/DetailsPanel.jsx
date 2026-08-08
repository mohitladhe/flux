import { AnimatePresence, motion } from "framer-motion";
import { BellOff, FileLock2, Link2, Pin, ShieldCheck, X } from "lucide-react";
import { trustSignals } from "../data/messaging";
import { Avatar } from "./Avatar";

export function DetailsPanel({ conversation, open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ width: 0, x: 40 }}
          animate={{ width: "min(22rem,88vw)", x: 0 }}
          exit={{ width: 0, x: 40 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 h-full shrink-0 overflow-hidden border-l app-panel app-border"
        >
          <aside
            className={`relative z-10 h-full shrink-0 overflow-hidden border-l app-panel transition-[width,border-color] duration-300 ease-out ${
              open ? "w-[min(22rem,88vw)] app-border" : "w-0 border-transparent"
            }`}
          >
            <div
              className="flex h-full w-[min(22rem,88vw)] flex-col"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex h-16 items-center justify-between border-b app-border px-4">
                <p className="text-sm font-bold uppercase tracking-[0.2em] app-muted">
                  Details
                </p>
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-xl transition app-icon-button"
                  onClick={onClose}
                  aria-label="Close details panel"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="rounded-2xl border app-card p-6">
                  <div className="flex flex-col items-center">
                    <Avatar
                      label={conversation.display.avatar}
                      online={conversation.display.isOnline}
                      size="lg"
                    />

                    <h3 className="mt-4 text-xl font-bold text-center app-text">
                      {conversation.display.name}
                    </h3>

                    {conversation.display.username && (
                      <p className="mt-1 text-sm app-muted">
                        @{conversation.display.username}
                      </p>
                    )}

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold app-chip">
                      <ShieldCheck size={15} />
                      Verified room
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: BellOff, label: "Mute" },
                    { icon: Pin, label: "Pin" },
                    { icon: Link2, label: "Invite" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="rounded-xl border px-2 py-3 text-xs font-bold transition app-ghost-button"
                    >
                      <Icon size={18} className="mx-auto mb-2" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] app-faint">
                    Trust status
                  </p>
                  <div className="space-y-3">
                    {trustSignals.map(({ icon: Icon, label, detail }) => (
                      <div
                        key={label}
                        className="flex gap-3 rounded-xl border app-card p-3"
                      >
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl app-chip">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold app-text">{label}</p>
                          <p className="mt-1 text-xs app-faint">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] app-faint">
                    Encrypted files
                  </p>
                  {["production-checklist.enc", "device-fingerprints.enc"].map(
                    (file) => (
                      <button
                        key={file}
                        type="button"
                        className="mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition app-ghost-button"
                      >
                        <FileLock2 size={18} className="app-accent-text" />
                        <span className="min-w-0 truncate">{file}</span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
