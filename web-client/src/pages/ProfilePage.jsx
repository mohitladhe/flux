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

const AVATAR_GRADIENTS = [
  "avatar-primary",
  "avatar-work",
  "avatar-design",
  "avatar-team",
  "avatar-support",
  "avatar-neutral",
];

const DEFAULT_PROFILE = {
  displayName: "",
  username: "",
  email: "",
  avatarLabel: "U",
  avatarGradient: "avatar-neutral",
  status: "Available",
  about: "",
};

const STATUS_OPTIONS = [
  "Available",
  "Busy",
  "Away",
  "Do not disturb",
  "Invisible",
];

export function ProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const avatarLabel = getAvatarLabel(profile);

  const originalData = {
    username: "",
    email: "",
    name: "",
    status: "",
  };

  const currentData = {
    username: "",
    email: "",
    name: "",
    status: "",
  };

  const updateProfile = (field, value) => {};

  useEffect(() => {
    (async () => {
      
    })();
  }, []);

  // const validateProfile = () => {
  //   const nextErrors = {};

  //   if (!profile.displayName.trim()) {
  //     nextErrors.displayName = "Display name is required.";
  //   }

  //   if (!profile.username.trim()) {
  //     nextErrors.username = "Username is required.";
  //   } else if (!/^[a-zA-Z0-9_]+$/.test(profile.username)) {
  //     nextErrors.username = "Use only letters, numbers and underscores.";
  //   }

  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
  //     nextErrors.email = "Enter a valid email address.";
  //   }

  //   return nextErrors;
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    // const nextErrors = validateProfile();
    // setErrors(nextErrors);

    // if (Object.keys(nextErrors).length > 0) {
    //   setSavedMessage("");
    //   return;
    // }

    // setSavedMessage("Profile changes saved.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogoutDialogOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <main className="app-root h-dvh overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <form
        className="mx-auto grid w-full max-w-7xl gap-6"
        onSubmit={handleSubmit}
      >
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
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
            >
              <Save size={18} />
              Save changes
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
                onChange={(value) => updateProfile("displayName", value)}
              />
              <TextField
                label="Username"
                value={profile.username}
                error={errors.username}
                prefix={<AtSign size={18} className="app-faint" />}
                onChange={(value) => updateProfile("username", value)}
              />
              <TextField
                label="Email"
                type="email"
                value={profile.email}
                error={errors.email}
                prefix={<Mail size={18} className="app-faint" />}
                onChange={(value) => updateProfile("email", value)}
              />
              <TextField
                label="Avatar initials"
                value={profile.avatarLabel}
                maxLength={2}
                prefix={<Camera size={18} className="app-faint" />}
                onChange={(value) => updateProfile("avatarLabel", value)}
              />
              <label className="grid gap-2 text-sm font-semibold app-text">
                Status
                <select
                  value={profile.status}
                  onChange={(event) =>
                    updateProfile("status", event.target.value)
                  }
                  className="rounded-xl border px-4 py-3 text-sm outline-none app-input-shell"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status}>{status}</option>
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
                onChange={(event) => updateProfile("about", event.target.value)}
                className="resize-none rounded-xl border px-4 py-3 text-sm outline-none app-input-shell app-input"
              />
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
                    className={`grid size-10 place-items-center rounded-xl border transition ${
                      profile.avatarGradient === gradient
                        ? "border-blue-400"
                        : "app-border"
                    } ${gradient}`}
                    aria-label={`Choose ${gradient}`}
                  >
                    {profile.avatarGradient === gradient && (
                      <CheckCircle2 size={18} color="white" />
                    )}
                  </button>
                ))}
              </div>
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
  const customLabel = profile.avatarLabel.trim();

  if (customLabel) {
    return customLabel.slice(0, 2).toUpperCase();
  }

  const displayNameLabel = profile.displayName
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return displayNameLabel || "U";
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
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm outline-none app-input"
        />
      </span>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </label>
  );
}
