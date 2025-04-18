import { create } from "zustand";
import {
  deleteChat,
  fetchChats,
  fetchMessages,
} from "../../../servises/actionsFetches";
import { useChatStore } from "../lastMessage";
import { Chat, Contact } from "../../../interfaces";

interface ChatProps {
  chats: Chat[];
  messages: any[];
  contactReceived: Chat[];
  contactSent: Chat[];
  selectedChat: Chat | null;
  isLoading: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  deleteChat: (chatId: number) => Promise<void>;
  fetchChat: (userId: number) => Promise<void>;
  fetchMessages: (currentChatid: number) => Promise<void>;

  useChatset: (chat: Chat) => void;
}

export const ChatStore = create<ChatProps>((set) => ({
  chats: [],
  messages: [],
  contactReceived: [],
  contactSent: [],
  isLoadingMessages: false,
  selectedChat: null,
  isLoading: false,
  error: null,
  useChatset: (chat) => set({ selectedChat: chat }),

  fetchChat: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchChats(userId);
      console.log("Данные с сервера:", res);

      const sortedChatsByTime = res.chats.sort((a: Chat, b: Chat) => {
        const lastMessageA = a.messages?.[a.messages.length - 1]?.createdAt;
        const lastMessageB = b.messages?.[b.messages.length - 1]?.createdAt;

        if (lastMessageA && lastMessageB) {
          return (
            new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime()
          );
        }

        return 0;
      });

      const lastMessagesMap = res.chats.reduce(
        (acc: Record<number, string>, chat: Chat) => {
          if (chat.messages.length > 0) {
            const lastMessage =
              chat.messages[chat.messages.length - 1]?.text || "";
            acc[chat.id] = lastMessage;
          }
          return acc;
        },
        {}
      );

      console.log(lastMessagesMap, "lastMessages");

      useChatStore.setState((state) => ({
        lastMessage: {
          ...state.lastMessage,
          ...lastMessagesMap,
        },
      }));

      const contactReceived = sortedChatsByTime
        .flatMap((chat: Chat) =>
          chat.users.flatMap((user) => user.user.contactsReceived)
        )
        .filter((contact: Contact) => contact.contactId !== userId);

      console.log(contactReceived, "contactReceivedcontactReceived");
      const sentChats = sortedChatsByTime
        .flatMap((chat: Chat) =>
          chat.users.flatMap((user) => user.user.contactsSent)
        )
        .filter((contact: Contact) => contact.contactId === userId);

      console.log(sentChats, "sentChatssentChats");

      console.log("Отсортированные чаты:", sortedChatsByTime);
      set({
        chats: sortedChatsByTime,
        isLoading: false,
        contactReceived: contactReceived,
        contactSent: sentChats,
      });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch chats", isLoading: false });
    }
  },
  deleteChat: async (chatId: number) => {
    try {
      await deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        selectedChat:
          state.selectedChat?.id === chatId ? null : state.selectedChat,
      }));
      await fetchMessages(chatId);
    } catch (error) {
      console.log(error);
      set({ error: "Failed to delete chat" });
    }
  },

  fetchMessages: async (currentChat: number) => {
    set({ isLoadingMessages: true });
    try {
      const res = await fetchMessages(currentChat);
      console.log(res, "mesRes");
      const sortedMessages = res.sort((a: any, b: any) => a.id - b.id);
      useChatStore.setState((state) => ({
        lastMessage: {
          ...state.lastMessage,
          [Number(currentChat)]:
            sortedMessages[sortedMessages.length - 1]?.text || "",
        },
      }));
      set({ messages: sortedMessages, error: null, isLoadingMessages: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to delete chat", isLoadingMessages: false });
    }
  },
}));
