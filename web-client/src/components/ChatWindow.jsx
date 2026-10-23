
import { useEffect, useRef, Fragment } from "react";
import {
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";
import { MessageDateSeparator } from "./MessageDateSeparator";
import { SystemMessage } from "./SystemMessage";
import { useChatStore } from "../store/chatStore";
import { getMessages } from "../services/messageService";
import { isDifferentDay } from "../utils/isDifferentDay";

export function ChatWindow({
  conversation,
  onOpenSidebar,
  onOpenDetails,
  onLoading,
}) {
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    const conversationId = conversation?._id;

    if (!conversationId) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        onLoading?.(true);

        const result = await getMessages(conversationId);

        if (cancelled) return;

        if (!Array.isArray(result)) {
          console.error("Unexpected messages API response:", result);
          setMessages([]);
          return;
        }

        const formattedMessages = result.map((message) => ({
          ...message,
          status: "sent",
        }));

        setMessages(formattedMessages);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load messages:", error);
        }
      } finally {
        if (!cancelled) {
          onLoading?.(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [conversation?._id, onLoading, setMessages]);

  return (
    <section className="flex min-w-0 flex-1 flex-col app-chat-surface">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b app-border app-panel px-3 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border app-border app-icon-button transition lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open conversations"
          >
            <Menu size={20} />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <button
              type="button"
              onClick={onOpenDetails}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-1.5 text-left transition hover:bg-[var(--app-hover)]"
              aria-label="Open conversation details"
            >
              <Avatar
                label={conversation.display?.avatar}
                online={conversation.display?.isOnline}
              />

              <div className="min-w-0">
                <h2 className="truncate text-base font-bold app-text sm:text-lg">
                  {conversation.display?.name ?? "Conversation"}
                </h2>

                <div className="flex items-center gap-1 text-xs font-medium app-success-text">
                  <ShieldCheck size={13} />
                  E2EE verified
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {[Search, Phone, Video].map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={
                    ["Search", "Voice call", "Video call"][index]
                  }
                  className="hidden size-10 place-items-center rounded-xl app-icon-button sm:grid"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Icon size={19} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6">
        <div className="mx-auto flex w-full flex-col gap-3">
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];

            const showDate =
              !previousMessage ||
              isDifferentDay(
                previousMessage.createdAt,
                message.createdAt,
              );

            return (
              <Fragment key={message._id ?? message.clientId ?? index}>
                {showDate && (
                  <MessageDateSeparator
                    timestamp={message.createdAt}
                  />
                )}

                {message.type === "system" ? (
                  <SystemMessage message={message} />
                ) : (
                  <MessageBubble message={message} />
                )}
              </Fragment>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatComposer />
    </section>
  );
}
