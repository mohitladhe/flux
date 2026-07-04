import { useState, useEffect } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { ConversationSidebar } from "../components/ConversationSidebar";
import { DetailsPanel } from "../components/DetailsPanel";
import { EmptyChatState } from "../components/EmptyChatState";
import { conversations } from "../data/messaging";
import { LoadingPage } from "../components/LoadingPage";

export function MessagingShell() {
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Later:
        // const response = await axios.get("/api/conversations");
        // setConversations(response.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const selectedConversation = conversations.find((conversation) => conversation.id === activeId);

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
      {loading && <LoadingPage/>}
    </div>
  );
}
