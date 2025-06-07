import { GetListResponse } from "./GetListResponse";

export interface CreateFollowCommand {
  followerId: string;
  followedId: string;
}

export interface CreatedFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
}

export interface UpdateFollowCommand {
  id: string;
  followerId: string;
  followedId: string;
}

export interface UpdatedFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
  updatedDate: string;
}

export interface DeletedFollowResponse {
  id: string;
}

export interface GetByIdFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
}

export interface GetListFollowListItemDto {
  id: string;
  followerId: string;
  followedId: string;
}

export type GetListFollowResponse = GetListResponse<GetListFollowListItemDto>;
