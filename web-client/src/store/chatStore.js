
import { create } from "zustand";

const getId = (value) => {
  if (value == null) return null;

  const id =
    typeof value === "object"
      ? value._id ?? value.id
      : value;

  return id == null ? null : String(id);
};

export const useChatStore = create((set) => ({
  activeConversation: null,
  conversationList: [],
  messages: [],

  setActiveConversation: (conversation) =>
    set((state) => ({
      activeConversation: conversation,
      messages:
        getId(state.activeConversation) === getId(conversation)
          ? state.messages
          : [],
    })),

  setConversationList: (conversations) =>
    set((state) => {
      const activeId = getId(state.activeConversation);
      const latestActive = conversations.find(
        (item) => getId(item) === activeId,
      );

      return {
        conversationList: conversations,
        activeConversation: latestActive
          ? {
              ...state.activeConversation,
              ...latestActive,
            }
          : state.activeConversation,
      };
    }),

  addConversation: (conversation) =>
    set((state) => ({
      conversationList: [
        conversation,
        ...state.conversationList.filter(
          (item) => getId(item) !== getId(conversation),
        ),
      ],
    })),

  updateConversation: (conversation) => {
    if (!conversation?._id) return;

    set((state) => {
      const conversationId = getId(conversation);
      const existing = state.conversationList.find(
        (item) => getId(item) === conversationId,
      );

      const updatedConversation = {
        ...existing,
        ...conversation,
      };

      const conversationList = existing
        ? state.conversationList.map((item) =>
            getId(item) === conversationId
              ? updatedConversation
              : item,
          )
        : [updatedConversation, ...state.conversationList];

      const activeConversation =
        getId(state.activeConversation) === conversationId
          ? {
              ...state.activeConversation,
              ...updatedConversation,
            }
          : state.activeConversation;

      return {
        conversationList,
        activeConversation,
      };
    });
  },

  setMessages: (messages) =>
    set({
      messages: Array.isArray(messages) ? messages : [],
    }),

  addMessage: (message) =>
    set((state) => {
      if (!message) return state;

      const messageId = getId(message);

      if (
        messageId &&
        state.messages.some(
          (existing) => getId(existing) === messageId,
        )
      ) {
        return state;
      }

      return {
        messages: [...state.messages, message],
      };
    }),

  updateMessage: (clientId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.clientId === clientId
          ? { ...message, ...updates }
          : message,
      ),
    })),

  clearChat: () =>
    set({
      activeConversation: null,
      messages: [],
    }),
}));
