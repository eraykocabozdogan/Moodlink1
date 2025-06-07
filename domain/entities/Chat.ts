import { ChatParticipant } from "./ChatParticipant";
import { Message } from "./Message";

export interface Chat {
  id: string;
  name?: string;
  chatType: ChatType;
  createdAt: Date;
  updatedAt?: Date;

  participants?: ChatParticipant[];
  messages?: Message[];

  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    sentAt: Date;
  };
}

export enum ChatType {
  Direct = 0,
  Group = 1,
}
