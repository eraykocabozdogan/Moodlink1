import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";
import { ActivityParticipation } from "../../domain/entities/ActivityParticipation";
import { ActivityApi } from "../datasources/remote/ActivityApi";
import { ActivityMapper } from "../mappers/ActivityMapper";
import { PageRequestDto } from "../dto/common";

export class ActivityRepositoryImpl implements IActivityRepository {
  constructor(private activityApi: ActivityApi) {}

  async create(activity: Activity): Promise<Activity> {
    const dto = ActivityMapper.toCreateDto(activity);
    const response = await this.activityApi.create(dto);
    return ActivityMapper.toEntity(response);
  }

  async update(activity: Activity): Promise<Activity> {
    const dto = ActivityMapper.toUpdateDto(activity);
    const response = await this.activityApi.update(dto);

    // Since the API response might not include all the activity details,
    // we merge the response with the original activity
    return {
      ...activity,
      name: response.name,
      description: response.description,
      eventTime: response.eventTime,
      location: response.location,
      category: response.category,
      targetMoodDescription: response.targetMoodDescription,
      updatedAt: response.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.activityApi.delete(id);
    return true;
  }

  async getById(id: string): Promise<Activity> {
    const response = await this.activityApi.getById(id);
    return ActivityMapper.detailedToEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    const pageRequest: PageRequestDto = { page, pageSize };
    const response = await this.activityApi.getList(pageRequest);

    return {
      items: response.items.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: response.count,
      totalPages: response.pages,
    };
  }

  async getUserActivities(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    const pageRequest: PageRequestDto = { page, pageSize };
    const response = await this.activityApi.getUserActivities(
      userId,
      pageRequest
    );

    return {
      items: response.items.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: response.count,
      totalPages: response.pages,
    };
  }

  async getRecommendedActivities(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }> {
    const pageRequest: PageRequestDto = { page, pageSize };
    const response = await this.activityApi.getRecommendedActivities(
      pageRequest
    );

    return {
      items: response.items.map((item) =>
        ActivityMapper.listItemToEntity(item)
      ),
      totalCount: response.count,
      totalPages: response.pages,
    };
  }

  // Note: These methods are placeholders; actual implementation would depend on
  // the ActivityParticipation API endpoints which weren't fully detailed
  async participateInActivity(
    activityId: string,
    userId: string
  ): Promise<ActivityParticipation> {
    // This would typically call an API endpoint to join an activity
    return {
      id: "",
      activityId,
      userId,
      joinedAt: new Date(),
    };
  }

  async leaveActivity(activityId: string, userId: string): Promise<boolean> {
    // This would typically call an API endpoint to leave an activity
    return true;
  }
}
