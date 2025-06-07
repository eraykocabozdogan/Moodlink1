import { Comment } from "../../domain/entities/Comment";
import {
  CreatedCommentResponse,
  GetByIdCommentResponse,
  GetListCommentListItemDto,
  CreateCommentCommand,
  UpdateCommentCommand,
} from "../dtos/CommentDto";

export class CommentMapper {
  /**
   * Maps a CreatedCommentResponse to Comment entity
   */
  static toEntity(dto: CreatedCommentResponse): Comment {
    return {
      id: dto.id,
      postId: dto.postId,
      userId: dto.userId,
      content: dto.content || "",
      parentCommentId: dto.parentCommentId || undefined,
      createdAt: new Date(), // DTO'da createdAt yok, şimdilik current date
      likes: 0, // Default value, as this is not in the Created response
    };
  }

  /**
   * Maps a GetByIdCommentResponse to Comment entity
   */
  static detailedToEntity(dto: GetByIdCommentResponse): Comment {
    return {
      id: dto.id,
      postId: dto.postId,
      userId: dto.userId,
      content: dto.content || "",
      parentCommentId: dto.parentCommentId || undefined,
      createdAt: new Date(), // DTO'da createdAt yok
      updatedAt: undefined, // DTO'da updatedAt yok
      user: undefined, // DTO'da user object yok
      likes: 0, // DTO'da likeCount yok
      isLiked: false, // DTO'da isLikedByCurrentUser yok
      replies: undefined, // DTO'da replies yok
    };
  }

  /**
   * Maps a GetListCommentListItemDto to a partial Comment entity for lists
   */
  static listItemToEntity(dto: GetListCommentListItemDto): Comment {
    return {
      id: dto.id,
      postId: dto.postId,
      userId: dto.userId,
      content: dto.content || "",
      parentCommentId: dto.parentCommentId || undefined,
      createdAt: new Date(), // DTO'da createdAt yok
      updatedAt: undefined, // DTO'da updatedAt yok
      user: undefined, // DTO'da user object yok
      likes: 0, // DTO'da likeCount yok
      isLiked: false, // DTO'da isLikedByCurrentUser yok
    };
  }

  /**
   * Maps a Comment entity to a CreateCommentCommand DTO
   */
  static toCreateCommand(entity: Comment): CreateCommentCommand {
    return {
      postId: entity.postId,
      userId: entity.userId,
      content: entity.content,
      parentCommentId: entity.parentCommentId || undefined,
    };
  }

  /**
   * Maps a Comment entity to an UpdateCommentCommand DTO
   */
  static toUpdateCommand(entity: Comment): UpdateCommentCommand {
    return {
      id: entity.id,
      content: entity.content,
    };
  }
}
