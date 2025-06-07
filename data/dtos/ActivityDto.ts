import { GetListResponse } from "./GetListResponse";

// Activity
export interface CreateActivityCommand {
  name?: string | null;
  description?: string | null;
  eventTime: string;
  location?: string | null;
  createdByUserId: string;
  category?: string | null;
  targetMoodDescription?: string | null;
  activityImageFileId?: string | null;
}

export interface CreatedActivityResponse {
  id: string;
  name?: string | null;
  description?: string | null;
  eventTime: string;
  location?: string | null;
  createdByUserId: string;
  category?: string | null;
  targetMoodDescription?: string | null;
  activityImageFileId?: string | null;
}

export interface UpdateActivityCommand {
  id: string;
  name?: string | null;
  description?: string | null;
  eventTime: string;
  location?: string | null;
  createdByUserId: string;
  category?: string | null;
  targetMoodDescription?: string | null;
  activityImageFileId?: string | null;
  requestingUserId: string;
}

export interface UpdatedActivityResponse extends CreatedActivityResponse {}

export interface DeletedActivityResponse {
  id: string;
}

export interface GetByIdActivityResponse extends CreatedActivityResponse {}

export interface GetListActivityListItemDto extends CreatedActivityResponse {}

export type GetListActivityResponse =
  GetListResponse<GetListActivityListItemDto>;

// User specific Activity DTOs
export interface UserActivityListItemDto {
  id: string;
  name?: string | null;
  description?: string | null;
  eventTime: string;
  location?: string | null;
  category?: string | null;
  targetMoodDescription?: string | null;
  activityImageFileId?: string | null;
  createdDate: string;
  participantCount: number;
  isEventPassed: boolean;
  isUserParticipant: boolean;
  createdByUserName?: string | null;
}

export type GetUserActivitiesResponse =
  GetListResponse<UserActivityListItemDto>;

export interface CategoryStatsDto {
  categoryName?: string | null;
  activityCount: number;
}

export interface UserActivityStatsResponse {
  totalCreatedActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  totalParticipatedActivities: number;
  totalParticipants: number;
  mostPopularActivity: any; // Define properly if schema is available
  categoriesUsed?: CategoryStatsDto[] | null;
}

// ActivityParticipation
export interface CreateActivityParticipationCommand {
  activityId: string;
  userId: string;
  joinedDate: string;
}

export interface CreatedActivityParticipationResponse {
  id: string;
  activityId: string;
  userId: string;
  joinedDate: string;
}

export interface UpdateActivityParticipationCommand
  extends CreatedActivityParticipationResponse {
  id: string;
}

export interface UpdatedActivityParticipationResponse
  extends CreatedActivityParticipationResponse {}

export interface DeletedActivityParticipationResponse {
  id: string;
}

export interface GetByIdActivityParticipationResponse
  extends CreatedActivityParticipationResponse {}

export interface GetListActivityParticipationListItemDto
  extends CreatedActivityParticipationResponse {}

export type GetListActivityParticipationResponse =
  GetListResponse<GetListActivityParticipationListItemDto>;
