import { LockKeyhole, Menu, MessageCircleMore, ShieldCheck } from "lucide-react";

export function EmptyChatState({ onOpenSidebar }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col app-chat-surface">
      <header className="flex h-16 shrink-0 items-center border-b app-border app-panel px-3 sm:px-5 lg:hidden">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border app-border app-icon-button transition"
          onClick={onOpenSidebar}
          aria-label="Open conversations"
        >
          <Menu size={20} />
        </button>
      </header>

      <div className="grid min-h-0 flex-1 place-items-center px-5 py-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-2xl border app-chip">
            <MessageCircleMore size={36} />
          </div>
          <h2 className="mt-6 text-2xl font-bold app-text sm:text-3xl">Select a chat</h2>
          <p className="mt-3 text-sm leading-6 app-muted">
            Choose a conversation from the inbox to open messages, profile details, and verified
            security status.
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-xl border app-card p-4">
              <LockKeyhole size={20} className="app-accent-text" />
              <p className="mt-3 text-sm font-bold app-text">Private by default</p>
              <p className="mt-1 text-xs leading-5 app-faint">Encrypted rooms stay idle until selected.</p>
            </div>
            <div className="rounded-xl border app-card p-4">
              <ShieldCheck size={20} className="app-success-text" />
              <p className="mt-3 text-sm font-bold app-text">Verified sessions</p>
              <p className="mt-1 text-xs leading-5 app-faint">Device trust appears with each chat.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
