import { useEffect, useState } from "react";
import {
  Check,
  MessageCircle,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { searchUser } from "../services/userService";
import {
  createConversation,
  createGroup,
} from "../services/conversationService";
import { useChatStore } from "../store/chatStore";
import { conversations } from "../data/messaging";

export function NewChatOverlay({ open, onClose }) {
  const [mode, setMode] = useState("direct");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const addConversation = useChatStore((state) => state.addConversation);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const search = query.trim();

    if (search.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError("");

      try {
        const data = await searchUser(search);
        setSearchResults(data);
        setHasSearched(true);
      } catch (searchError) {
        setError(
          searchError.response?.data?.message || "Unable to search users.",
        );
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [open, query]);

  if (!open) {
    return null;
  }

  const resetOverlay = () => {
    setMode("direct");
    setQuery("");
    setError("");
    setGroupName("");
    setSelectedMembers([]);
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
  };

  const handleClose = () => {
    resetOverlay();
    onClose();
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setQuery("");
    setError("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleStartChat = async (user) => {
    try {
      const conversation = await createConversation(user._id);
      addConversation(conversation);
      setActiveConversation(conversation);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to start chat.");
    }
  };

  const toggleMember = (user) => {
    setError("");
    setSelectedMembers((prev) => {
      const alreadySelected = prev.some((member) => member._id === user._id);

      if (alreadySelected) {
        return prev.filter((member) => member._id !== user._id);
      }

      return [...prev, user];
    });
  };

  const removeMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member._id !== userId),
    );
  };

  const handleCreateGroup = async () => {
    const trimmedGroupName = groupName.trim();

    if (!trimmedGroupName) {
      setError("Enter a group name.");
      return;
    }

    if (selectedMembers.length < 2) {
      setError("Select at least two members.");
      return;
    }

    try {
      const conversation = await createGroup(
        trimmedGroupName,
        selectedMembers.map((user) => user._id),
      );
      addConversation(conversation);
      setActiveConversation(conversation);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create group chat.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "group") {
      handleCreateGroup();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-chat-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close new chat"
        onClick={handleClose}
      />

      <section className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border app-card-strong shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b app-border p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl app-chip">
              {mode === "group" ? (
                <UsersRound size={20} />
              ) : (
                <MessageCircle size={20} />
              )}
            </div>
            <div>
              <h2 id="new-chat-title" className="text-lg font-bold app-text">
                New Chat
              </h2>
              <p className="text-sm app-muted">
                {mode === "group"
                  ? "Create a group and add members"
                  : "Choose someone to message"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="grid size-10 place-items-center rounded-xl transition app-icon-button"
            aria-label="Close new chat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b app-border p-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl border app-input-shell p-1">
            <button
              type="button"
              onClick={() => handleModeChange("direct")}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                mode === "direct" ? "app-selected" : "app-muted"
              }`}
            >
              Direct Chat
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("group")}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                mode === "group" ? "app-selected" : "app-muted"
              }`}
            >
              Group
            </button>
          </div>

          {mode === "group" && (
            <label className="mt-4 grid gap-2 text-sm font-semibold app-text">
              Group name
              <input
                value={groupName}
                onChange={(event) => {
                  setGroupName(event.target.value);
                  setError("");
                }}
                className="rounded-xl border px-4 py-3 text-sm outline-none app-input-shell app-input"
                placeholder="Enter group name"
              />
            </label>
          )}

          {mode === "group" && selectedMembers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => removeMember(member._id)}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition app-ghost-button"
                >
                  <span>{getUserName(member)}</span>
                  <X size={14} />
                </button>
              ))}
            </div>
          )}

          <form className="mt-4" onSubmit={handleSubmit}>
            <label
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                error ? "border-red-500" : ""
              }`}
            >
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  setError("");

                  if (nextQuery.trim().length < 2) {
                    setSearchResults([]);
                    setHasSearched(false);
                    setIsSearching(false);
                  }
                }}
                className="w-full bg-transparent outline-none app-input"
                placeholder={
                  mode === "group"
                    ? "Search members by name or username"
                    : "Search by name or username"
                }
              />
            </label>
            {error && (
              <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
            )}
          </form>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {searchResults.length > 0 ? (
            <div className="grid gap-2">
              {searchResults.map((user) => {
                const selected = selectedMembers.some(
                  (member) => member._id === user._id,
                );

                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() =>
                      mode === "group"
                        ? toggleMember(user)
                        : handleStartChat(user)
                    }
                    className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition app-text hover:bg-[var(--app-hover)]"
                  >
                    <Avatar
                      label={getAvatarLabel(user)}
                      online={user.isOnline}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold">
                          {getUserName(user)}
                        </p>
                        <span className="shrink-0 text-xs app-faint">
                          {user.status ||
                            (user.isOnline ? "Online" : "Offline")}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs app-muted">
                        {user.username ? `@${user.username}` : user.email}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                        selected
                          ? "app-selected app-selected-muted"
                          : "app-chip"
                      }`}
                    >
                      {selected && <Check size={14} />}
                      {mode === "group"
                        ? selected
                          ? "Selected"
                          : "Add"
                        : "Start"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptySearchState
              hasSearched={hasSearched}
              isSearching={isSearching}
              mode={mode}
            />
          )}
        </div>

        {mode === "group" && (
          <div className="flex flex-col gap-3 border-t app-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm app-muted">
              {selectedMembers.length} member
              {selectedMembers.length === 1 ? "" : "s"} selected
            </p>
            <button
              type="button"
              onClick={handleCreateGroup}
              className="rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
            >
              Create Group
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptySearchState({ hasSearched, isSearching, mode }) {
  const title = isSearching
    ? "Searching..."
    : hasSearched
      ? "No users found"
      : mode === "group"
        ? "Add group members"
        : "New Chat";

  const detail = isSearching
    ? ""
    : hasSearched
      ? "Try a different name, username, or email."
      : mode === "group"
        ? "Search for people and select multiple members."
        : "Search for someone to start chatting.";

  return (
    <div className="grid place-items-center gap-3 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-xl app-chip">
        <UserRound size={22} />
      </div>
      <div>
        <p className="text-sm font-bold app-text">{title}</p>
        {detail && <p className="mt-1 text-sm app-muted">{detail}</p>}
      </div>
    </div>
  );
}

function getUserName(user) {
  return user.name || user.username || "Unknown user";
}

function getAvatarLabel(user) {
  const label = user.avatar || user.name || user.username || "U";

  return label.slice(0, 2).toUpperCase();
}
