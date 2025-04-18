import { Chat } from "./chat.interface";
import { User } from "./user.interfaces";

export interface Message {
  id: number;
  text: string;
  senderId: number;
  chatId: number;
  createdAt: string;
  replyToId?: number | null;
  replyTo?: Message | null;
  replies?: Message[];
  sender: User;
  chat: Chat;
}
