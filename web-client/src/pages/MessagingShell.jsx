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
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const setConversationList = useChatStore(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const conversations = await getConversations();
        setConversationList(conversations.data);
        console.log(conversations);
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // const conversationList = useChatStore((state) => state.conversationList);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === activeId,
  );

  const handleSelectConversation = (conversationId) => {
    setActiveId(conversationId);
    setDetailsOpen(false);
  };

  return (
    <div className="relative flex h-dvh overflow-hidden app-root">
      <ConversationSidebar
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {selectedConversation ? (
        <>
          <ChatWindow
            conversation={selectedConversation}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenDetails={() => setDetailsOpen(true)}
          />
          <DetailsPanel
            conversation={selectedConversation}
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
