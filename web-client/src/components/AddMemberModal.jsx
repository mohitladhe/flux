import { useEffect, useState } from "react";
import { Search, UserRound, X } from "lucide-react";
import { searchUser } from "../services/userService";
import { Avatar } from "./Avatar";
import { addMember } from "../services/conversationService";

export function AddMemberModal({ open, onClose, conversation, onMemberAdded }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const search = query.trim();

    if (search.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
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

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      setError("");
      setSelectedMember(null);
    }
  }, [open]);

  const existingMemberIds = new Set(
    (conversation?.participants || []).map((member) => member._id?.toString()),
  );

  const availableUsers = searchResults.filter(
    (user) => !existingMemberIds.has(user._id?.toString()),
  );

  const handleAddMember = async () => {
    if (!selectedMember || isAdding) return;

    try {
      setIsAdding(true);
      setError("");

      const updatedConversation = await addMember(
        conversation._id,
        selectedMember._id,
      );

      onMemberAdded(updatedConversation);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to add member.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/50 px-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close add member"
        onClick={onClose}
      />

      <section className="relative w-full max-w-sm overflow-hidden rounded-2xl border app-card-strong shadow-2xl">
        <div className="flex items-center justify-between border-b app-border p-4">
          <div>
            <h3 className="text-sm font-bold app-text">Add member</h3>

            <p className="mt-1 text-xs app-muted">
              Search people to add to this group.
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
          <label className="flex items-center gap-3 rounded-xl border px-3 py-3 app-input-shell">
            <Search size={17} />

            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              className="w-full bg-transparent text-sm outline-none app-input"
              placeholder="Search by name or username"
            />
          </label>

          <div className="mt-4">
            {isSearching ? (
              <div className="rounded-xl border app-card p-4 text-center">
                <p className="text-sm font-bold app-text">Searching...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border app-card p-4 text-center">
                <p className="text-sm font-bold text-red-500">{error}</p>
              </div>
            ) : availableUsers.length > 0 ? (
              <div className="space-y-1">
                {availableUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      setSelectedMember(user);
                      setError("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      selectedMember?._id === user._id
                        ? "app-selected"
                        : "hover:bg-[var(--app-hover)]"
                    }`}
                  >
                    <Avatar
                      label={user.avatar || user.name || user.username || "U"}
                      online={user.isOnline}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold app-text">
                        {user.name || user.username || "Unknown user"}
                      </p>

                      <p className="mt-1 truncate text-xs app-muted">
                        {user.username ? `@${user.username}` : user.email}
                      </p>
                    </div>

                    {selectedMember?._id === user._id && (
                      <span className="shrink-0 rounded-lg app-chip px-3 py-1.5 text-xs font-bold app-accent-text">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border app-card p-4 text-center">
                <p className="text-sm font-bold app-text">
                  {hasSearched ? "No users found" : "Search users"}
                </p>

                <p className="mt-1 text-xs app-muted">
                  {hasSearched
                    ? "Try a different name or username."
                    : "Search for someone to add to this group."}
                </p>
              </div>
            )}
          </div>

          {selectedMember && (
            <div className="mt-4 rounded-xl border app-card p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  label={
                    selectedMember.avatar ||
                    selectedMember.name ||
                    selectedMember.username ||
                    "U"
                  }
                  online={selectedMember.isOnline}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold app-text">
                    {selectedMember.name ||
                      selectedMember.username ||
                      "Unknown user"}
                  </p>

                  <p className="truncate text-xs app-muted">
                    {selectedMember.username
                      ? `@${selectedMember.username}`
                      : selectedMember.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="grid size-8 shrink-0 place-items-center rounded-lg app-icon-button"
                  aria-label="Remove selected member"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!selectedMember || isAdding}
            onClick={handleAddMember}
            className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
              selectedMember
                ? "app-accent-button"
                : "cursor-not-allowed opacity-50 app-accent-button"
            }`}
          >
            {isAdding ? "isAdding..." : "Add Member"}
          </button>
        </div>
      </section>
    </div>
  );
}
