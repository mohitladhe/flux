import { create } from "zustand";

export const useChatStore = create((set) => ({
  activeConversation: null,
  conversationList: [],
  messages: [],

  setActiveConversation: (conversation) =>
    set({
      activeConversation: conversation,
    }),

  setConversationList: (conversations) =>
    set({
      conversationList: conversations,
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  clearChat: () =>
    set({
      activeConversation: null,
      messages: [],
    }),
}));
