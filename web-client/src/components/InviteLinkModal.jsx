import { Check, Copy, LoaderCircle, X } from "lucide-react";

export function InviteLinkModal({
  open,
  onClose,
  inviteLink,
  inviteCopied,
  onCopy,
  expiresAt,
  loading,
  error,
  revoked,
  revoking,
  onRevoke,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close invite link"
        onClick={onClose}
      />

      <section className="relative w-full max-w-sm overflow-hidden rounded-2xl border app-card-strong shadow-2xl">
        <div className="flex items-center justify-between border-b app-border p-4">
          <div>
            <h3 className="text-sm font-bold app-text">
              Invite link
            </h3>

            <p className="mt-1 text-xs app-muted">
              Anyone with this link can join the group.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl transition app-icon-button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border app-input-shell p-4 text-sm app-muted">
              <LoaderCircle size={17} className="animate-spin" />
              Creating invite link…
            </div>
          ) : inviteLink ? (
            <>
              <div className="rounded-xl border app-input-shell p-3">
                <p className="break-all text-xs font-semibold app-text">
                  {inviteLink}
                </p>
              </div>
              {expiresAt && (
                <p className="mt-2 text-xs app-muted">
                  Expires {new Date(expiresAt).toLocaleString()}
                </p>
              )}

              <button
                type="button"
                onClick={onCopy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
              >
                {inviteCopied ? <Check size={17} /> : <Copy size={17} />}
                {inviteCopied ? "Copied" : "Copy invite link"}
              </button>
            </>
          ) : revoked ? (
            <p className="rounded-xl border app-input-shell p-3 text-sm app-muted">
              This invite link has been revoked.
            </p>
          ) : null}

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

          {!loading && inviteLink && (
            <button
              type="button"
              onClick={onRevoke}
              disabled={revoking}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {revoking && <LoaderCircle size={16} className="animate-spin" />}
              {revoking ? "Revoking…" : "Revoke invite link"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}