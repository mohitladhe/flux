import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  File,
  Image,
  Link2,
  LockKeyhole,
  LogOut,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import {
  createConversation,
  generateGroupInvite,
  updateAdminStatus,
  removeMember,
  revokeGroupInvite,
} from "../services/conversationService";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import { Avatar } from "./Avatar";
import { AddMemberModal } from "./AddMemberModal";
import { InviteLinkModal } from "./InviteLinkModal";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { getMessages } from "../services/messageService";

const BASE_MEMBER_ACTIONS = [
  { key: "view-profile", label: "View Profile" },
  { key: "message", label: "Message" },
];

const GROUP_CREATOR_ACTIONS = [
  { key: "make-admin", label: "Make admin" },
  { key: "remove-admin", label: "Remove admin" },
];

const GROUP_ADMIN_ACTIONS = [
  { key: "remove-member", label: "Remove member", danger: true },
];

const MENU_WIDTH = 136;
const MENU_HEIGHT = 108;

export function GroupDetailsPanel({
  conversation,
  open,
  onClose,
  onViewProfile,
}) {
  const [menuState, setMenuState] = useState({
    memberId: null,
    position: null,
  });
  const [adminOverlay, setAdminOverlay] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteRevoking, setInviteRevoking] = useState(false);
  const [inviteRevoked, setInviteRevoked] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [expandedMembersConversationId, setExpandedMembersConversationId] =
    useState(null);
  const [leaveConfirmationOpen, setLeaveConfirmationOpen] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const currentUser = useAuthStore((state) => state.user);
  const addConversation = useChatStore((state) => state.addConversation);
  const conversationList = useChatStore((state) => state.conversationList);
  const setConversationList = useChatStore(
    (state) => state.setConversationList,
  );
  const updateConversation = useChatStore((state) => state.updateConversation);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );
  const addMessage = useChatStore((state) => state.addMessage);
  const currentConversation =
    activeConversation?._id === conversation?._id
      ? activeConversation
      : conversation;

  const members = currentConversation?.participants || [];
  const groupName = currentConversation.display?.name || "Group chat";
  const groupAvatar =
    currentConversation.display?.avatar || getInitials(groupName);
  const currentUserIsAdmin = isGroupAdmin(currentUser, currentConversation);
  const currentUserIsGroupCreator = isSameEntity(
    currentUser,
    currentConversation.groupCreator,
  );
  const inviteLink = getInviteLink(generatedInvite?.token);
  const showAllMembers =
    expandedMembersConversationId === currentConversation?._id;
  const displayedMembers = showAllMembers ? members : members.slice(0, 4);

  const handleClose = () => {
    setMenuState({ memberId: null, position: null });
    setAdminOverlay(null);
    onClose();
  };

  const handleAdminOverlayClose = () => {
    setAdminOverlay(null);
    setInviteCopied(false);
    setInviteError("");
    setGeneratedInvite(null);
    setInviteRevoked(false);
  };

  const handleOpenInvite = async () => {
    setAdminOverlay("invite-link");
    setInviteCopied(false);
    setInviteError("");
    setInviteRevoked(false);
    setGeneratedInvite(null);
    setInviteLoading(true);

    try {
      const invite = await generateGroupInvite(currentConversation._id);
      setGeneratedInvite(invite);
    } catch (error) {
      console.error(error);
      setInviteError(
        error.response?.data?.message || "Could not create an invite link.",
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const handleMemberActionToggle = (event, memberId) => {
    event.preventDefault();
    event.stopPropagation();

    const isSameMember = menuState.memberId === memberId;

    setMenuState(
      isSameMember
        ? { memberId: null, position: null }
        : {
            memberId,
            position: {
              x: event.clientX,
              y: event.clientY,
            },
          },
    );
  };

  const refreshConversationMessages = async (conversationId) => {
    try {
      const result = await getMessages(conversationId);

      const messages = Array.isArray(result) ? result : [];

      const store = useChatStore.getState();
      const activeId = store.activeConversation?._id;

      if (String(activeId) === String(conversationId)) {
        store.setMessages(messages);
      }
    } catch (error) {
      console.error("Failed to refresh messages after group update:", error);
    }
  };

  const handleMemberAction = async (actionKey, member) => {
    setMenuState({ memberId: null, position: null });

    if (actionKey === "view-profile") {
      onViewProfile?.(member);
      return;
    }

    if (actionKey === "message") {
      try {
        const directConversation = await createConversation(
          getMemberId(member),
        );
        addConversation(directConversation);
        setActiveConversation(directConversation);
        onClose();
      } catch (error) {
        console.error(error);
      }
    }

    if (actionKey === "make-admin") {
      try {
        const updatedConversation = await updateAdminStatus(
          currentConversation._id,
          getMemberId(member),
          true,
        );

        console.log("UPDATED CONVERSATION:", updatedConversation);

        updateConversation(updatedConversation);

        onClose();
      } catch (error) {
        console.error(error);
      }
    }

    if (actionKey === "remove-admin") {
      try {
        const updatedConversation = await updateAdminStatus(
          currentConversation._id,
          getMemberId(member),
          false,
        );

        console.log("UPDATED CONVERSATION:", updatedConversation);

        updateConversation(updatedConversation);

        onClose();
      } catch (error) {
        console.error(error);
      }
    }

    if (actionKey === "remove-member") {
      const conversationId = currentConversation?._id;
      const memberId = getMemberId(member);

      if (!conversationId || !memberId) {
        console.error("Missing conversation ID or member ID.");
        return;
      }

      try {
        const result = await removeMember(conversationId, memberId);

        // The backend returns { conversation, systemMessage }.
        const updatedConversation = result?.conversation;
        const systemMessage = result?.systemMessage;

        if (!updatedConversation?._id) {
          throw new Error("The API did not return the updated conversation.");
        }

        // Refresh active conversation and sidebar state.
        updateConversation(updatedConversation);

        // Add the newly saved system message immediately.
        if (systemMessage) {
          addMessage(systemMessage);
        }

        // Close the panel and clear the member action menu.
        handleClose();
      } catch (error) {
        console.error("REMOVE MEMBER FAILED:", error.response?.data ?? error);
      }

      return;
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteCopied(true);
    } catch (error) {
      console.error(error);
      setInviteError("Could not copy the invite link.");
    }
  };

  const handleRevokeInvite = async () => {
    setInviteRevoking(true);
    setInviteError("");

    try {
      await revokeGroupInvite(currentConversation._id);
      setGeneratedInvite(null);
      setInviteCopied(false);
      setInviteRevoked(true);
    } catch (error) {
      console.error(error);
      setInviteError(
        error.response?.data?.message || "Could not revoke the invite link.",
      );
    } finally {
      setInviteRevoking(false);
    }
  };

  const handleLeaveGroup = async () => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) {
      setLeaveError("Could not identify your account.");
      return;
    }

    setLeavingGroup(true);
    setLeaveError("");

    try {
      await removeMember(currentConversation._id, userId);
      setConversationList(
        conversationList.filter((item) => item._id !== currentConversation._id),
      );
      setActiveConversation(null);
      setLeaveConfirmationOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      setLeaveError(
        error.response?.data?.message || "Could not leave this group.",
      );
    } finally {
      setLeavingGroup(false);
    }
  };

  useEffect(() => {
    if (!menuState.memberId) {
      return;
    }

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-member-trigger], [data-member-menu]")
      ) {
        return;
      }

      setMenuState({ memberId: null, position: null });
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuState.memberId]);

  const menuPosition = getMenuPosition(menuState.position);

  const selectedMember = members.find(
    (member) => getMemberId(member) === menuState.memberId,
  );

  const selectedMemberIsAdmin = selectedMember
    ? isGroupAdmin(selectedMember, currentConversation)
    : false;

  const selectedMemberIsGroupCreator = selectedMember
    ? isSameEntity(selectedMember, currentConversation.groupCreator)
    : false;

  const selectedMemberActions = selectedMember
    ? getMemberActions({
        currentUserIsAdmin,
        currentUserIsGroupCreator,
        selectedMemberIsAdmin,
        selectedMemberIsGroupCreator,
      })
    : [];

  return (
    <>
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
                  onClick={handleClose}
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
                    Group · {members.length}{" "}
                    {members.length === 1 ? "member" : "members"}
                  </p>
                </section>

                <section className="border-b app-border px-4 py-5">
                  <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] app-faint">
                    Group members
                  </p>

                  {currentUserIsAdmin && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdminOverlay("add-member")}
                        className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition app-ghost-button"
                      >
                        <UserPlus size={15} />
                        Add member
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenInvite}
                        className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition app-ghost-button"
                      >
                        <Link2 size={15} />
                        Invite link
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    {displayedMembers.map((member) => {
                      const isCurrentUser = isSameUser(member, currentUser);
                      const isMemberAdmin = isGroupAdmin(
                        member,
                        currentConversation,
                      );

                      const memberName =
                        member.name || member.username || "Unknown user";

                      const memberId = getMemberId(member);

                      return (
                        <div key={memberId} className="relative">
                          <button
                            type="button"
                            disabled={isCurrentUser}
                            data-member-trigger
                            onClick={(event) =>
                              handleMemberActionToggle(event, memberId)
                            }
                            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left ${
                              isCurrentUser
                                ? "cursor-default"
                                : "transition hover:bg-[var(--app-hover)]"
                            }`}
                          >
                            <Avatar
                              label={getMemberAvatar(member)}
                              online={member.isOnline}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 items-center gap-2">
                                <p className="truncate text-sm font-bold app-text">
                                  {isCurrentUser ? "You" : memberName}
                                </p>

                                {isMemberAdmin && (
                                  <span className="shrink-0 rounded-md app-chip px-1.5 py-0.5 text-[10px] font-semibold app-accent-text">
                                    Admin
                                  </span>
                                )}
                              </div>

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
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {members.length > 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMembersConversationId(
                          showAllMembers ? null : currentConversation._id,
                        )
                      }
                      className="mt-3 w-full rounded-xl border px-3 py-2 text-xs font-bold transition app-ghost-button"
                      aria-expanded={showAllMembers}
                    >
                      {showAllMembers
                        ? "Show fewer members"
                        : `Show all ${members.length} members`}
                    </button>
                  )}
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

                <section className="border-t app-border px-4 py-5">
                  {leaveError && (
                    <p role="alert" className="mb-3 text-sm text-red-500">
                      {leaveError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setLeaveConfirmationOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Leave group
                  </button>
                </section>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {open &&
        menuState.memberId &&
        menuPosition &&
        createPortal(
          <div
            data-member-menu
            className="fixed z-[9999] w-[136px] overflow-hidden rounded-lg border app-card-strong py-0.5 shadow-xl"
            style={{
              left: `${menuPosition.left}px`,
              top: `${menuPosition.top}px`,
            }}
          >
            {selectedMemberActions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => handleMemberAction(action.key, selectedMember)}
                className={`block w-full whitespace-nowrap px-2 py-1 text-left text-sm font-extralight leading-tight transition hover:bg-[var(--app-hover)] ${
                  action.danger ? "text-red-500" : "app-text"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      <AddMemberModal
        open={open && adminOverlay === "add-member"}
        onClose={handleAdminOverlayClose}
        conversation={currentConversation}
        onMemberAdded={(result) => {
          // Support either a direct conversation or { conversation, systemMessage }
          const updatedConversation = result?.conversation ?? result;

          if (!updatedConversation?._id) {
            console.error(
              "Invalid conversation returned after adding member:",
              result,
            );
            return;
          }

          // Update the conversation list and active conversation
          updateConversation(updatedConversation);
          setActiveConversation(updatedConversation);

          // Add the system message if the API returned one
          if (result?.systemMessage) {
            addMessage(result.systemMessage);
          }

          onClose();
        }}
      />
      <InviteLinkModal
        open={open && adminOverlay === "invite-link"}
        onClose={handleAdminOverlayClose}
        inviteLink={inviteLink}
        inviteCopied={inviteCopied}
        onCopy={handleCopyInviteLink}
        expiresAt={generatedInvite?.expiresAt}
        loading={inviteLoading}
        error={inviteError}
        revoked={inviteRevoked}
        revoking={inviteRevoking}
        onRevoke={handleRevokeInvite}
      />
      <ConfirmationDialog
        open={leaveConfirmationOpen}
        title="Leave this group?"
        description={`You will no longer receive messages from ${groupName}.`}
        confirmLabel={leavingGroup ? "Leaving…" : "Leave group"}
        confirmTone="danger"
        icon={LogOut}
        onConfirm={handleLeaveGroup}
        onCancel={() => setLeaveConfirmationOpen(false)}
      />
    </>
  );

  function DetailStat({ icon: Icon, label, value }) {
    return (
      <div className="rounded-xl border px-2 py-3 text-center app-ghost-button">
        <Icon size={17} className="mx-auto app-accent-text" />
        <p className="mt-2 text-sm font-bold app-text">{value}</p>
        <p className="mt-0.5 text-xs app-muted">{label}</p>
      </div>
    );
  }

  function getMenuPosition(position) {
    if (!position) {
      return null;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 6;
    const edgePadding = 8;
    let left = position.x + gap;
    let top = position.y + gap;

    if (left + MENU_WIDTH > viewportWidth - edgePadding) {
      left = position.x - MENU_WIDTH - gap;
    }

    if (top + MENU_HEIGHT > viewportHeight - edgePadding) {
      top = position.y - MENU_HEIGHT - gap;
    }

    return {
      left: Math.max(
        edgePadding,
        Math.min(left, viewportWidth - MENU_WIDTH - edgePadding),
      ),
      top: Math.max(
        edgePadding,
        Math.min(top, viewportHeight - MENU_HEIGHT - edgePadding),
      ),
    };
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
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "GC"
    );
  }

  function getMemberAvatar(member) {
    return (
      member.avatar || getInitials(member.name || member.username || "User")
    );
  }

  function getMemberId(member) {
    return (
      member._id || member.id || member.username || member.email || member.name
    );
  }

  function getInviteLink(token) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return token ? `${origin}/group-invite/${token}` : "";
  }

  function isSameUser(member, currentUser) {
    const memberId = member._id?.toString();
    const currentUserId =
      currentUser?._id?.toString() || currentUser?.id?.toString();

    return Boolean(memberId && currentUserId && memberId === currentUserId);
  }

  function getMemberActions({
    currentUserIsAdmin,
    currentUserIsGroupCreator,
    selectedMemberIsAdmin,
    selectedMemberIsGroupCreator,
  }) {
    const actions = [...BASE_MEMBER_ACTIONS];

    // Group Creator
    if (currentUserIsGroupCreator) {
      // Creator clicking another admin
      if (selectedMemberIsAdmin) {
        actions.push(GROUP_CREATOR_ACTIONS[1]);
      }
      // Creator clicking a normal member
      else if (!selectedMemberIsGroupCreator) {
        actions.push(GROUP_CREATOR_ACTIONS[0]);
      }

      // Creator can remove any member except themselves
      if (!selectedMemberIsGroupCreator) {
        actions.push(GROUP_ADMIN_ACTIONS[0]);
      }

      return actions;
    }

    // Normal Admin
    if (currentUserIsAdmin) {
      // Admin can remove only normal members.
      // Admin cannot remove another admin or the creator.
      if (!selectedMemberIsAdmin && !selectedMemberIsGroupCreator) {
        actions.push(GROUP_ADMIN_ACTIONS[0]);
      }
    }

    return actions;
  }

  function isSameEntity(a, b) {
    const aId = a?._id?.toString() || a?.id?.toString() || a?.toString();
    const bId = b?._id?.toString() || b?.id?.toString() || b?.toString();

    return Boolean(aId && bId && aId === bId);
  }

  function isGroupAdmin(user, conversation) {
    const admins = conversation?.admins || conversation?.admin;

    if (!user || !admins) {
      return false;
    }

    return Array.isArray(admins)
      ? admins.some((admin) => isSameEntity(user, admin))
      : isSameEntity(user, admins);
  }
}
