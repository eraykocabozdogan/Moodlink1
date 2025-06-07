import { GetListResponse } from "./GetListResponse";

export interface CreateMessageCommand {
  chatId: string;
  senderUserId: string;
  content?: string | null;
  sentDate: string;
  attachmentFileId?: string | null;
}

export interface CreatedMessageResponse {
  id: string;
  chatId: string;
  senderUserId: string;
  content?: string | null;
  sentDate: string;
  attachmentFileId?: string | null;
}

export interface UpdateMessageCommand {
  id: string;
  content?: string | null;
}

export interface UpdatedMessageResponse {
  id: string;
  chatId: string;
  senderUserId: string;
  content?: string | null;
  sentDate: string;
  updatedDate: string;
  attachmentFileId?: string | null;
}

export interface GetListMessageListItemDto {
  id: string;
  chatId: string;
  senderUserId: string;
  content?: string | null;
  sentDate: string;
  senderUserName?: string;
}

export type GetListMessageResponse = GetListResponse<GetListMessageListItemDto>;

export interface SendMessageCommand {
  chatId: string;
  content: string;
}

export interface SendMessageResponse {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdDate: string;
}

export interface SendDirectMessageCommand {
  receiverId: string;
  content: string;
}

export interface SendDirectMessageResponse {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdDate: string;
}

export interface ChatMessageDto {
  id: string;
  chatId: string;
  senderUserId: string;
  senderUserName?: string | null;
  senderFirstName?: string | null;
  senderLastName?: string | null;
  content?: string | null;
  sentDate: string;
  attachmentFileUrl?: string | null;
  attachmentFileName?: string | null;
}

export type GetChatMessagesResponse = GetListResponse<ChatMessageDto>;

export interface DeletedMessageResponse {
  id: string;
}

export interface GetByIdMessageResponse {
  id: string;
  chatId: string;
  senderUserId: string;
  content?: string | null;
  sentDate: string;
  updatedDate?: string | null;
  attachmentFileId?: string | null;
}
