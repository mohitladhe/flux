import { useState, useEffect } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { DetailsPanel } from "../components/DetailsPanel";
import { EmptyChatState } from "../components/EmptyChatState";
import { conversations } from "../data/messaging";
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
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const conversations = await getConversations();
        setConversationList(conversations);
        console.log(conversations);
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // const selectedConversation = conversations.find(
  //   (conversation) => conversation.id === activeId,
  // );

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    console.log(conversation);
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
          <DetailsPanel
            conversation={activeConversation}
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          />
        </>
      ) : (
        <EmptyChatState onOpenSidebar={() => setSidebarOpen(true)} />
      )}
      {loading && <LoadingPage />}
    </div>
  );
}
