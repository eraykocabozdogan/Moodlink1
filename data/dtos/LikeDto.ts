import { GetListResponse } from "./GetListResponse";

export interface CreateLikeCommand {
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface CreatedLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface UpdateLikeCommand {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface UpdatedLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
  updatedDate: string;
}

export interface DeletedLikeResponse {
  id: string;
}

export interface GetByIdLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface GetListLikeListItemDto {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export type GetListLikeResponse = GetListResponse<GetListLikeListItemDto>;
