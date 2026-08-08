import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, UserRound, X } from "lucide-react";
import { Avatar } from "./Avatar";
import { searchUser } from "../services/userService";
import { createConversation } from "../services/conversationService";
import { LoadingPage } from "./LoadingPage";
import { useChatStore } from "../store/chatStore";

export function NewChatOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { setActiveConversation } = useChatStore();

  useEffect(() => {
    const search = query.trim();
    if (search.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setErrors("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchUser(search);
        console.log(data);
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        setErrors(error.response?.data?.message ?? "Unable to search users.");
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setQuery("");
    onClose();
    setSearchResults([]);
    setErrors("");
    setHasSearched(false);
  };

  const handleStartChat = async (user) => {
    try {
      setQuery("");
      const conversation = await createConversation(user._id);
      setActiveConversation(conversation);
      console.log(conversation);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsSearching(true);
  //   setErrors("");
  //   setSearchResults([]);
  //   try {
  //     const searchValue = query.trim().toLowerCase();
  //     if (!searchValue) {
  //       setErrors("Please enter username or name.");
  //       setIsSearching(false);
  //       return;
  //     }

  //     const data = await searchUser(searchValue);
  //     if (data) {
  //       setSearchResults(data);
  //     }

  //     setHasSearched(true);
  //   } catch (error) {
  //     setErrors(error.response?.data?.message || "Unable to search the users.");
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  return (
    <>
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

        <section className="relative flex max-h-[86dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border app-card-strong shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b app-border p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl app-chip">
                <MessageCircle size={20} />
              </div>
              <div>
                <h2 id="new-chat-title" className="text-lg font-bold app-text">
                  New Chat
                </h2>
                <p className="text-sm app-muted">Search people</p>
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

          <form className="border-b app-border p-5">
            <label
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                errors ? "border-red-500" : ""
              }`}
            >
              <Search size={18} />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none app-input"
                placeholder="Search by name or username"
              />
            </label>
          </form>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {searchResults.length > 0 ? (
              <div className="grid gap-2">
                {searchResults.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleStartChat(user)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition app-text hover:bg-[var(--app-hover)]"
                  >
                    <Avatar
                      label={user.avatar}
                      name={user.name}
                      online={user.isOnline}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold">
                          {user.name}
                        </p>
                        <span className="shrink-0 text-xs app-faint">
                          {user.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs app-muted">
                        {user.username}
                      </p>
                    </div>
                    <span className="rounded-xl px-3 py-2 text-xs font-bold app-chip">
                      Start
                    </span>
                  </button>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="grid place-items-center gap-3 px-6 py-12 text-center">
                <div className="grid size-12 place-items-center rounded-xl app-chip">
                  <UserRound size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold app-text">
                    {isSearching ? "Searching..." : "No users found"}
                  </p>
                  <p className="mt-1 text-sm app-muted">
                    {isSearching
                      ? ""
                      : "Try a different name, username, or email."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid place-items-center gap-3 px-6 py-12 text-center">
                <div className="grid size-12 place-items-center rounded-xl app-chip">
                  <UserRound size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold app-text">
                    {isSearching ? "Searching..." : "New Chat"}
                  </p>
                  <p className="mt-1 text-sm app-muted">
                    {isSearching ? "" : "Search for someone to start chatting."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
