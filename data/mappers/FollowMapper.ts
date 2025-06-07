import { Follow } from "../../domain/entities/Follow";
import { CreateFollowCommand, CreatedFollowResponse } from "../dtos/FollowDto";

export class FollowMapper {
  static toEntity(dto: CreatedFollowResponse): Follow {
    return {
      id: dto.id,
      followerId: dto.followerId,
      followedId: dto.followedId,
      // 'followedAt' is not part of the response, so we make it optional in the entity
      // or set a default. For now, using current date.
      followedAt: new Date(),
    };
  }

  static toCreateCommand(entity: Follow): CreateFollowCommand {
    return {
      followerId: entity.followerId,
      followedId: entity.followedId,
    };
  }
}
