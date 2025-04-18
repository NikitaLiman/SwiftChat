import { Message } from "./message.interface";
import { User } from "./user.interfaces";

export interface Chat {
  id: number;
  createdAT: string;
  name?: string | null;
  savedChat: boolean;
  users: ChatUser[];
  messages: Message[];
}

export interface ChatUser {
  id: number;
  userId: number;
  chatId: number;
  user: User;
  chat?: Chat;
}
