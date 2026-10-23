import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AtSign,
  Camera,
  CheckCircle2,
  LogOut,
  Mail,
  MessageCircle,
  Save,
  UserRound,
} from "lucide-react";

import { Avatar } from "../components/Avatar";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import {
  getMyProfile,
  updateMyProfile as saveProfile,
} from "../services/profileService";
import { useAuthStore } from "../store/authStore";

const AVATAR_GRADIENTS = [
  "avatar-primary",
  "avatar-work",
  "avatar-design",
  "avatar-team",
  "avatar-support",
  "avatar-neutral",
];

const STATUS_OPTIONS = [
  "Available",
  "Busy",
  "Away",
  "Do not disturb",
  "Invisible",
];

const DEFAULT_PROFILE = {
  displayName: "",
  username: "",
  email: "",
  avatarLabel: "",
  avatarGradient: "avatar-neutral",
  status: "Available",
  about: "",
};

const profileFromUser = (user) => ({
  displayName: user?.name ?? "",
  username: user?.username ?? "",
  email: user?.email ?? "",
  avatarLabel: user?.avatarLabel ?? "",
  avatarGradient: user?.avatarGradient ?? "avatar-neutral",
  status: user?.status ?? "Available",
  about: user?.about ?? "",
});

export function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const user = await getMyProfile();
        if (cancelled) return;

        setProfile(profileFromUser(user));
        // Keep the authenticated user in sync when the store exposes setUser.
        if (typeof setUser === "function") setUser(user);
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load Flux profile:", error);
          setErrors({
            form:
              error?.response?.data?.message ||
              error?.message ||
              "Unable to load your profile. Please try again.",
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const updateProfile = (field, value) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "", form: "" }));
    setSavedMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const displayName = profile.displayName.trim();
    const username = profile.username.trim();

    if (!displayName) {
      nextErrors.displayName = "Display name is required.";
    } else if (displayName.length > 50) {
      nextErrors.displayName = "Display name must be 50 characters or fewer.";
    }

    if (!/^[a-zA-Z0-9_.]{5,12}$/.test(username)) {
      nextErrors.username =
        "Username must be 5–12 characters and use letters, numbers, underscores, or full stops.";
    }

    if (profile.about.length > 140) {
      nextErrors.about = "About must be 140 characters or fewer.";
    }

    if (!STATUS_OPTIONS.includes(profile.status)) {
      nextErrors.status = "Choose a valid status.";
    }

    if (!AVATAR_GRADIENTS.includes(profile.avatarGradient)) {
      nextErrors.avatarGradient = "Choose a valid avatar color.";
    }

    setErrors(nextErrors);
    setSavedMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSaving(true);

      const user = await saveProfile({
        name: displayName,
        username,
        about: profile.about.trim(),
        status: profile.status,
        avatarLabel: profile.avatarLabel.trim().slice(0, 2).toUpperCase(),
        avatarGradient: profile.avatarGradient,
      });

      setProfile(profileFromUser(user));
      if (typeof setUser === "function") setUser(user);
      setSavedMessage("Profile changes saved.");
      setErrors({});
    } catch (error) {
      console.error("Unable to save Flux profile:", error);
      setErrors({
        form:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to save your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogoutDialogOpen(false);
    navigate("/", { replace: true });
  };

  const avatarLabel = getAvatarLabel(profile);

  return (
    <main className="app-root h-dvh overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <form
        className="mx-auto grid w-full max-w-7xl gap-6"
        onSubmit={handleSubmit}
      >
        {errors.form && (
          <p role="alert" className="text-sm text-red-500">
            {errors.form}
          </p>
        )}

        {isLoading && (
          <p className="text-sm app-muted" role="status">
            Loading your profile…
          </p>
        )}

        <header className="flex flex-col gap-4 border-b app-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid size-11 place-items-center rounded-xl border app-border app-icon-button transition"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase app-faint">
                Account settings
              </p>
              <h1 className="mt-1 text-2xl font-bold app-text sm:text-3xl">
                Profile
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {savedMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-500">
                <CheckCircle2 size={18} />
                {savedMessage}
              </div>
            )}

            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>

            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
          <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-2xl border app-card-strong p-5 text-center">
              <div className="mx-auto w-fit">
                <Avatar
                  label={avatarLabel}
                  gradient={profile.avatarGradient}
                  online
                  size="lg"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold app-text">
                {profile.displayName || "Display name"}
              </h2>
              <p className="mt-1 text-sm app-muted">
                @{profile.username || "username"}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold app-chip">
                <MessageCircle size={15} />
                {profile.status}
              </div>
            </section>
          </aside>

          <section className="rounded-2xl border app-card-strong p-5">
            <SectionTitle
              icon={UserRound}
              title="Public Profile"
              detail="Visible identity"
            />

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <TextField
                label="Display name"
                value={profile.displayName}
                error={errors.displayName}
                maxLength={50}
                placeholder="Enter your name"
                onChange={(value) => updateProfile("displayName", value)}
              />

              <TextField
                label="Username"
                value={profile.username}
                error={errors.username}
                prefix={<AtSign size={18} className="app-faint" />}
                maxLength={12}
                onChange={(value) => updateProfile("username", value)}
              />

              <TextField
                label="Email"
                type="email"
                value={profile.email}
                prefix={<Mail size={18} className="app-faint" />}
                readOnly
                helper="Email address cannot be changed here."
              />

              <TextField
                label="Avatar initials"
                value={profile.avatarLabel}
                error={errors.avatarLabel}
                maxLength={2}
                prefix={<Camera size={18} className="app-faint" />}
                onChange={(value) => updateProfile("avatarLabel", value)}
              />

              <label className="grid gap-2 text-sm font-semibold app-text lg:col-span-2">
                Status
                <select
                  value={profile.status}
                  onChange={(event) =>
                    updateProfile("status", event.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none app-input-shell"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                      style={{ backgroundColor: "#1a1d24", color: "#ffffff" }}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold app-text">
              About
              <textarea
                rows={4}
                value={profile.about}
                maxLength={140}
                placeholder="Hey there! I'm using Flux."
                onChange={(event) =>
                  updateProfile("about", event.target.value)
                }
                className="resize-none rounded-xl border px-4 py-3 text-sm outline-none app-input-shell app-input"
              />
              <span className="text-xs app-muted">
                {profile.about.length}/140 characters
              </span>
              {errors.about && (
                <p className="text-xs font-medium text-red-500">
                  {errors.about}
                </p>
              )}
            </label>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold app-text">
                Avatar color
              </p>
              <div className="flex flex-wrap gap-3">
                {AVATAR_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient}
                    type="button"
                    onClick={() => updateProfile("avatarGradient", gradient)}
                    className={`grid size-10 place-items-center rounded-xl border transition ${profile.avatarGradient === gradient ? "border-blue-400" : "app-border"} ${gradient}`}
                    aria-label={`Choose ${gradient}`}
                    aria-pressed={profile.avatarGradient === gradient}
                  >
                    {profile.avatarGradient === gradient && (
                      <CheckCircle2 size={18} color="white" />
                    )}
                  </button>
                ))}
              </div>
              {errors.avatarGradient && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.avatarGradient}
                </p>
              )}
            </div>
          </section>
        </div>
      </form>

      <ConfirmationDialog
        open={logoutDialogOpen}
        icon={LogOut}
        title="Logout?"
        description="You will need to log in again to access your chats and profile."
        confirmLabel="Logout"
        cancelLabel="Stay logged in"
        confirmTone="danger"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </main>
  );
}

function getAvatarLabel(profile) {
  const customLabel = (profile.avatarLabel || "").trim();
  if (customLabel) return customLabel.slice(0, 2).toUpperCase();

  const nameLabel = (profile.displayName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return nameLabel || "U";
}

function SectionTitle({ icon: Icon, title, detail }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl app-chip">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-lg font-bold app-text">{title}</h2>
        <p className="text-sm app-muted">{detail}</p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  prefix,
  type = "text",
  maxLength,
  readOnly = false,
  helper,
  placeholder,
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold app-text">
      {label}
      <span
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
          error ? "border-red-500" : ""
        }`}
      >
        {prefix}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full bg-transparent text-sm outline-none app-input ${
            readOnly ? "cursor-not-allowed opacity-70" : ""
          }`}
        />
      </span>
      {helper && <span className="text-xs app-muted">{helper}</span>}
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </label>
  );
}
