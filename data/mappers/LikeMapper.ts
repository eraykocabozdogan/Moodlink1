import { Like } from "../../domain/entities/Like";
import {
  CreateLikeCommand,
  CreatedLikeResponse,
  GetByIdLikeResponse,
  GetListLikeListItemDto,
  UpdateLikeCommand,
} from "../dtos/LikeDto";

export class LikeMapper {
  /**
   * Maps DTO to Like entity
   */
  static toEntity(
    dto: CreatedLikeResponse | GetByIdLikeResponse | GetListLikeListItemDto
  ): Like {
    return {
      id: dto.id,
      userId: dto.userId,
      postId: dto.postId || undefined,
      commentId: dto.commentId || undefined,
      createdDate: new Date(), // DTO'da createdDate yok, şimdilik current date
    };
  }

  /**
   * Maps a Like entity to create DTO request
   */
  static toCreateCommand(entity: Like): CreateLikeCommand {
    return {
      userId: entity.userId,
      postId: entity.postId || null,
      commentId: entity.commentId || null,
    };
  }

  /**
   * Maps a Like entity to update DTO request
   */
  static toUpdateCommand(entity: Like): UpdateLikeCommand {
    return {
      id: entity.id,
      userId: entity.userId,
      postId: entity.postId || null,
      commentId: entity.commentId || null,
    };
  }
}
