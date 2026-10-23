
import { useState, useEffect } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { DetailsPanel } from "../components/DetailsPanel";
import { GroupDetailsPanel } from "../components/GroupDetailsPanel";
import { EmptyChatState } from "../components/EmptyChatState";
import { LoadingPage } from "../components/LoadingPage";
import { getConversations } from "../services/conversationService";
import { useChatStore } from "../store/chatStore";

export function MessagingShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const setConversationList = useChatStore(
    (state) => state.setConversationList,
  );

  const activeConversation = useChatStore(
    (state) => state.activeConversation,
  );

  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      try {
        setLoading(true);

        const result = await getConversations();

        if (!cancelled) {
          setConversationList(
            Array.isArray(result) ? result : [],
          );
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, [setConversationList]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setDetailsOpen(false);
  };

  return (
    <div className="relative flex h-dvh overflow-hidden app-root">
      <ConversationSidebar
        onSelectConversation={handleSelectConversation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {activeConversation ? (
        <>
          <ChatWindow
            conversation={activeConversation}
            onLoading={setLoading}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenDetails={() => setDetailsOpen(true)}
          />

          {activeConversation.type === "group" ? (
            <GroupDetailsPanel
              conversation={activeConversation}
              open={detailsOpen}
              onClose={() => setDetailsOpen(false)}
            />
          ) : (
            <DetailsPanel
              conversation={activeConversation}
              open={detailsOpen}
              onClose={() => setDetailsOpen(false)}
            />
          )}
        </>
      ) : (
        <EmptyChatState
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      )}

      {loading && <LoadingPage />}
    </div>
  );
}
