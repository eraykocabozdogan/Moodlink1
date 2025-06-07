import { Activity } from "../../domain/entities/Activity";
import {
  CreatedActivityDto,
  GetByIdActivityDto,
  GetListActivityItemDto,
} from "../dto/activity";

export class ActivityMapper {
  /**
   * Maps a CreatedActivityDto to Activity entity
   */
  static toEntity(dto: CreatedActivityDto): Activity {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      eventTime: dto.eventTime,
      location: dto.location,
      createdByUserId: dto.createdByUserId,
      category: dto.category,
      targetMoodDescription: dto.targetMoodDescription,
      createdAt: dto.createdAt,
    };
  }

  /**
   * Maps a GetByIdActivityDto to Activity entity
   */
  static detailedToEntity(dto: GetByIdActivityDto): Activity {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      eventTime: dto.eventTime,
      location: dto.location,
      createdByUserId: dto.createdByUserId,
      category: dto.category,
      targetMoodDescription: dto.targetMoodDescription,
      imageUrl: dto.activityImageUrl,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      createdByUser: dto.createdByUser
        ? {
            id: dto.createdByUser.id,
            userName: dto.createdByUser.userName,
            firstName: dto.createdByUser.firstName,
            lastName: dto.createdByUser.lastName,
            profilePictureUrl: dto.createdByUser.profilePictureUrl,
          }
        : undefined,
      participantCount: dto.participantCount,
      isParticipating: dto.isParticipating,
    };
  }

  /**
   * Maps a GetListActivityItemDto to Activity entity
   */
  static listItemToEntity(dto: GetListActivityItemDto): Activity {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      eventTime: dto.eventTime,
      location: dto.location,
      createdByUserId: dto.createdByUserId,
      category: dto.category,
      targetMoodDescription: dto.targetMoodDescription,
      imageUrl: dto.activityImageUrl,
      createdAt: dto.createdAt,
      createdByUser: dto.createdByUser
        ? {
            id: dto.createdByUser.id,
            userName: dto.createdByUser.userName,
            firstName: dto.createdByUser.firstName,
            lastName: dto.createdByUser.lastName,
            profilePictureUrl: dto.createdByUser.profilePictureUrl,
          }
        : undefined,
      participantCount: dto.participantCount,
      isParticipating: dto.isParticipating,
    };
  }

  /**
   * Maps an Activity entity to create DTO request
   */
  static toCreateDto(entity: Activity): {
    name: string;
    description: string;
    eventTime: Date;
    location?: string;
    category?: string;
    targetMoodDescription?: string;
    activityImageFileId?: string;
  } {
    return {
      name: entity.name,
      description: entity.description,
      eventTime: entity.eventTime,
      location: entity.location,
      category: entity.category,
      targetMoodDescription: entity.targetMoodDescription,
      activityImageFileId: undefined, // This would need to be set separately
    };
  }

  /**
   * Maps an Activity entity to update DTO request
   */
  static toUpdateDto(entity: Activity): {
    id: string;
    name: string;
    description: string;
    eventTime: Date;
    location?: string;
    category?: string;
    targetMoodDescription?: string;
    activityImageFileId?: string;
  } {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      eventTime: entity.eventTime,
      location: entity.location,
      category: entity.category,
      targetMoodDescription: entity.targetMoodDescription,
      activityImageFileId: undefined, // This would need to be set separately
    };
  }
}
