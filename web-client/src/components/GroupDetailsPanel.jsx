import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  File,
  Image,
  Link2,
  LockKeyhole,
  UsersRound,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Avatar } from "./Avatar";

export function GroupDetailsPanel({ conversation, open, onClose }) {
  const currentUser = useAuthStore((state) => state.user);
  const members = conversation.participants || [];
  const groupName = conversation.display?.name || "Group chat";
  const groupAvatar = conversation.display?.avatar || getInitials(groupName);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ width: 0, x: 40 }}
          animate={{ width: "min(22rem,88vw)", x: 0 }}
          exit={{ width: 0, x: 40 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 h-full shrink-0 overflow-hidden border-l app-panel app-border"
          aria-label={`${groupName} group details`}
        >
          <div
            className="flex h-full w-[min(22rem,88vw)] flex-col"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b app-border px-4">
              <p className="text-sm font-bold app-text">Group info</p>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl transition app-icon-button"
                onClick={onClose}
                aria-label="Close group details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <section className="border-b app-border px-5 py-7 text-center">
                <div className="mx-auto w-fit">
                  <Avatar label={groupAvatar} size="lg" />
                </div>
                <h3 className="mt-4 break-words text-xl font-bold app-text">
                  {groupName}
                </h3>
                <p className="mt-1 text-sm app-muted">
                  Group · {members.length} {members.length === 1 ? "member" : "members"}
                </p>
              </section>

              <section className="border-b app-border px-4 py-5">
                <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] app-faint">
                  Group members
                </p>
                <div className="space-y-1">
                  {members.map((member) => {
                    const isCurrentUser = isSameUser(member, currentUser);
                    const memberName = member.name || member.username || "Unknown user";

                    return (
                      <div
                        key={member._id || member.username}
                        className="flex items-center gap-3 rounded-xl px-2 py-2"
                      >
                        <Avatar
                          label={getMemberAvatar(member)}
                          online={member.isOnline}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold app-text">
                            {isCurrentUser ? "You" : memberName}
                          </p>
                          <p className="truncate text-xs app-muted">
                            {isCurrentUser
                              ? memberName
                              : member.username
                                ? `@${member.username}`
                                : member.isOnline
                                  ? "Online"
                                  : "Offline"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="border-b app-border px-4 py-5">
                <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] app-faint">
                  Shared content
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <DetailStat icon={Image} label="Media" value="0" />
                  <DetailStat icon={Link2} label="Links" value="0" />
                  <DetailStat icon={File} label="Docs" value="0" />
                </div>
              </section>

              <section className="px-4 py-5">
                <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] app-faint">
                  Chat settings
                </p>
                <div className="overflow-hidden rounded-2xl border app-card">
                  <InfoRow
                    icon={Bell}
                    label="Notifications"
                    value="Default"
                  />
                  <InfoRow
                    icon={UsersRound}
                    label="Group permissions"
                    value="All members"
                  />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border app-chip p-3">
                  <LockKeyhole size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-medium leading-5">
                    Messages and calls in this group are end-to-end encrypted.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function DetailStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border px-2 py-3 text-center app-ghost-button">
      <Icon size={17} className="mx-auto app-accent-text" />
      <p className="mt-2 text-sm font-bold app-text">{value}</p>
      <p className="mt-0.5 text-xs app-muted">{label}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl app-chip">
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold app-text">{label}</p>
        <p className="mt-0.5 text-xs app-muted">{value}</p>
      </div>
      <ChevronRight size={18} className="app-faint" />
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "GC";
}

function getMemberAvatar(member) {
  return member.avatar || getInitials(member.name || member.username || "User");
}

function isSameUser(member, currentUser) {
  const memberId = member._id?.toString();
  const currentUserId = currentUser?._id?.toString() || currentUser?.id?.toString();

  return Boolean(memberId && currentUserId && memberId === currentUserId);
}
