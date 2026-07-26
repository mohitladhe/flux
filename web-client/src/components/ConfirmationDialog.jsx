export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  icon: Icon,
  confirmTone = "primary",
}) {
  if (!open) {
    return null;
  }

  const confirmClass =
    confirmTone === "danger"
      ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-400"
      : "app-accent-button";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={cancelLabel}
        onClick={onCancel}
      />

      <section className="relative w-full max-w-md rounded-2xl border app-card-strong p-5 shadow-2xl">
        <div className="flex gap-4">
          {Icon && (
            <div className="grid size-11 shrink-0 place-items-center rounded-xl app-chip">
              <Icon size={21} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 id="confirmation-title" className="text-lg font-bold app-text">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm leading-6 app-muted">{description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border px-4 py-3 text-sm font-bold transition app-ghost-button"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
