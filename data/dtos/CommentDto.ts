import { GetListResponse } from "./GetListResponse";

export interface CreateCommentCommand {
  postId: string;
  userId: string;
  content?: string | null;
  parentCommentId?: string | null;
}

export interface CreatedCommentResponse {
  id: string;
  postId: string;
  userId: string;
  content?: string | null;
  parentCommentId?: string | null;
}

export interface UpdateCommentCommand {
  id: string;
  content?: string | null;
}

export interface UpdatedCommentResponse {
  id: string;
  postId: string;
  userId: string;
  content?: string | null;
  parentCommentId?: string | null;
  updatedDate: string;
}

export interface DeletedCommentResponse {
  id: string;
}

export interface GetByIdCommentResponse {
  id: string;
  postId: string;
  userId: string;
  content?: string | null;
  parentCommentId?: string | null;
}

export interface GetListCommentListItemDto {
  id: string;
  postId: string;
  userId: string;
  content?: string | null;
  parentCommentId?: string | null;
}

export type GetListCommentResponse = GetListResponse<GetListCommentListItemDto>;
