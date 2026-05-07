import { useState } from "react";
import { ChatWindow } from "./ChatWindow";
import { ConversationSidebar } from "./ConversationSidebar";
import { DetailsPanel } from "./DetailsPanel";
import { EmptyChatState } from "./EmptyChatState";
import { conversations } from "../data/messaging";

export function MessagingShell() {
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedConversation = conversations.find((conversation) => conversation.id === activeId);

  const handleSelectConversation = (conversationId) => {
    setActiveId(conversationId);
    setDetailsOpen(false);
  };

  return (
    <div className="flex h-dvh overflow-hidden app-root">
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
    </div>
  );
}
