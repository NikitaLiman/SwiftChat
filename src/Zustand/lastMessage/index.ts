import { create } from "zustand";

interface ChatStore {
  lastMessage: { [chatId: string]: string };
  setLastMessage: (chatId: string, message: string) => void;
  setMesge: (message: string) => void;
  Mesge: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  Mesge: null,
  setMesge: (message: string) => {
    set(() => ({
      Mesge: message,
    }));
  },
  lastMessage: {},
  setLastMessage(chatId, message) {
    set((state) => ({
      lastMessage: { ...state.lastMessage, [chatId]: message },
    }));
  },
}));
