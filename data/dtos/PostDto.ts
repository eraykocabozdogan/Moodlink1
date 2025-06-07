import { AnalysisStatus } from "../enums/AnalysisStatus";
import { GetListResponse } from "./GetListResponse";

// From schema: PostEmotionScoreDto is not explicitly defined, but CreatedPostResponse refers to it.
// Assuming it's similar to other basic DTOs or can be defined later.
export interface PostEmotionScoreDto {
  [key: string]: any; // Placeholder
}

export interface CreatePostCommand {
  userId: string;
  contentText?: string | null;
  postImageFileId?: string | null;
}

export interface CreatedPostResponse {
  id: string;
  userId: string;
  contentText?: string | null;
  analysisStatus: AnalysisStatus;
  postImageFileId?: string | null;
  emotionScores?: PostEmotionScoreDto[] | null;
}

export interface UpdatePostCommand {
  id: string;
  contentText?: string | null;
  postImageFileId?: string | null;
}

export interface UpdatedPostResponse {
  id: string;
  userId: string;
  contentText?: string | null;
  analysisStatus: AnalysisStatus;
  postImageUrl?: string;
  createdDate: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  emotionScores?: PostEmotionScoreDto[];
}

// GetListPostListItemDto is not in the schema, using GetByIdPostResponse as a base
export interface GetListPostListItemDto {
  id: string;
  userId: string;
  contentText?: string | null;
  analysisStatus: AnalysisStatus;
  postImageUrl?: string;
  createdDate: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  emotionScores?: PostEmotionScoreDto[];
}

export type GetListPostResponse = GetListResponse<GetListPostListItemDto>;

// This DTO is now fully defined in the schema
export interface GetFollowedUsersPostsListItemDto
  extends GetListPostListItemDto {
  moodCompatibility?: number;
}

export type GetFollowedUsersPostsResponse =
  GetListResponse<GetFollowedUsersPostsListItemDto>;

export interface DeletedPostResponse {
  id: string;
}

export interface GetByIdPostResponse {
  id: string;
  userId: string;
  contentText?: string | null;
  analysisStatus: AnalysisStatus;
  postImageUrl?: string;
  createdDate: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  emotionScores?: PostEmotionScoreDto[];
}
