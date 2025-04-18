import { ChatUser } from "./chat.interface";
import { Contact } from "./contact.interface";
import { Message } from "./message.interface";

export interface User {
  id: number;
  fullname: string;
  email: string;
  bio?: string;
  password: string;
  role: UserRole;
  provider?: string | null;
  avatar?: string | null;
  providerId?: string | null;
  verified?: string | null;
  createdAT: string;
  updateAT: string;
  UserStatus?: UserStatus[];
  chats?: ChatUser[];
  messages?: Message[];
  contactsSent?: Contact[];
  contactsReceived?: Contact[];
}

export interface UserStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string | null;
  user?: User;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
