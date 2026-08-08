import { create } from "zustand";
import { messages } from "../data/messaging";

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

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (clientId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.clientId === clientId ? { ...message, ...updates } : message,
      ),
    })),

  clearChat: () =>
    set({
      activeConversation: null,
      messages: [],
    }),
}));
