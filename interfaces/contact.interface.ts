import { User } from "./user.interfaces";

export interface Contact {
  id: number;
  createdAT: string;
  accepted: boolean;
  userId: number;
  contactId: number;
  user: User;
  contact: User;
}
