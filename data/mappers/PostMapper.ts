import { Post } from "../../domain/entities/Post";
import { EmotionScore } from "../../domain/entities/EmotionScore";
import {
  CreatedPostResponse,
  GetByIdPostResponse,
  GetListPostListItemDto,
  GetFollowedUsersPostsListItemDto,
  PostEmotionScoreDto,
} from "../dtos/PostDto";

export class PostMapper {
  /**
   * Maps a PostDto to Post entity - works for both CreatedPostResponse and GetByIdPostResponse
   */
  static toEntity(dto: CreatedPostResponse | GetByIdPostResponse): Post {
    // Handle CreatedPostResponse (minimal data)
    if (!("user" in dto)) {
      return {
        id: dto.id,
        userId: dto.userId,
        user: {
          id: dto.userId,
          userName: "",
          firstName: "",
          lastName: "",
        },
        contentText: dto.contentText || "",
        createdDate: new Date(),
        analysisStatus: dto.analysisStatus,
        likes: 0,
        comments: 0,
      };
    }

    // Handle GetByIdPostResponse (detailed data)
    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.user.id,
        userName: dto.user.userName,
        firstName: dto.user.firstName,
        lastName: dto.user.lastName,
        profilePictureUrl: dto.user.profilePictureUrl,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageUrl,
      createdDate: new Date(dto.createdDate),
      updatedDate: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      analysisStatus: dto.analysisStatus,
      likes: dto.likeCount,
      comments: dto.commentCount,
      isLiked: dto.isLikedByCurrentUser,
      emotionScores: dto.emotionScores?.map(
        (es: PostEmotionScoreDto): EmotionScore => ({
          id: "",
          ownerId: dto.id,
          ownerType: 1,
          emotionType: es.emotionType,
          score: es.score,
        })
      ),
    };
  }

  /**
   * Maps a GetByIdPostDto to Post entity
   */
  static detailedToEntity(dto: GetByIdPostResponse): Post {
    return this.toEntity(dto);
  }

  /**
   * Maps a GetListPostItemDto to Post entity
   */
  static listItemToEntity(dto: GetListPostListItemDto): Post {
    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.user.id,
        userName: dto.user.userName,
        firstName: dto.user.firstName,
        lastName: dto.user.lastName,
        profilePictureUrl: dto.user.profilePictureUrl,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageUrl,
      createdDate: new Date(dto.createdDate),
      updatedDate: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      analysisStatus: dto.analysisStatus,
      likes: dto.likeCount,
      comments: dto.commentCount,
      isLiked: dto.isLikedByCurrentUser,
      emotionScores: dto.emotionScores?.map(
        (es: PostEmotionScoreDto): EmotionScore => ({
          id: "",
          ownerId: dto.id,
          ownerType: 1,
          emotionType: es.emotionType,
          score: es.score,
        })
      ),
    };
  }

  /**
   * Maps a GetFollowedUsersPostsItemDto to Post entity
   */
  static followedPostToEntity(dto: GetFollowedUsersPostsListItemDto): Post {
    const post = this.listItemToEntity(dto);
    return {
      ...post,
      moodCompatibility: dto.moodCompatibility?.toString(),
    };
  }

  /**
   * Maps a Post entity to create DTO request
   */
  static toCreateDto(entity: Post): {
    userId: string;
    contentText: string;
    postImageFileId?: string;
  } {
    return {
      userId: entity.userId,
      contentText: entity.contentText,
      postImageFileId: entity.imageUrl ? undefined : undefined,
    };
  }

  /**
   * Maps a Post entity to update DTO request
   */
  static toUpdateDto(entity: Post): {
    id: string;
    contentText: string;
    postImageFileId?: string;
  } {
    return {
      id: entity.id,
      contentText: entity.contentText,
      postImageFileId: entity.imageUrl ? undefined : undefined,
    };
  }
}
