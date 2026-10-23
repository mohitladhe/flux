import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, UserRound, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function ProfileCompletionIndicator() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) {
    return null;
  }

  const completedFields = [
    user.name?.trim(),
    user.username?.trim(),
    user.email?.trim(),
    user.avatarLabel?.trim() || user.avatar?.trim(),
    user.about?.trim(),
  ].filter(Boolean).length;
  const completion = Math.round((completedFields / 5) * 100);
  const isComplete = completion === 100;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex w-[min(20rem,calc(100vw-2rem))] items-start gap-2 rounded-2xl border app-card-strong p-3 shadow-2xl">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="min-w-0 flex-1 rounded-xl p-1 text-left transition hover:bg-[var(--app-hover)]"
        aria-label={`Profile ${completion}% complete. Open profile settings.`}
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl app-chip">
            {isComplete ? (
              <CheckCircle2 size={20} className="app-success-text" />
            ) : (
              <UserRound size={20} className="app-accent-text" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-bold app-text">
                {isComplete ? "Profile complete" : "Complete the Profile"}
              </p>
              <span className="shrink-0 text-sm font-bold app-accent-text">
                {completion}%
              </span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--app-soft)]"
              role="progressbar"
              aria-label="Profile completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion}
            >
              <div
                className="h-full rounded-full app-accent-button transition-[width]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="grid size-8 shrink-0 place-items-center rounded-lg app-icon-button"
        aria-label="Dismiss profile completion indicator"
      >
        <X size={17} />
      </button>
    </div>
  );
}
