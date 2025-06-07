import { Activity } from "../entities/Activity";
import { ActivityParticipation } from "../entities/ActivityParticipation";

/**
 * Repository interface for Activity entity operations
 */
export interface IActivityRepository {
  /**
   * Creates a new activity
   */
  create(activity: Activity): Promise<Activity>;

  /**
   * Updates an existing activity
   */
  update(activity: Activity): Promise<Activity>;

  /**
   * Deletes an activity by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets an activity by ID
   */
  getById(id: string): Promise<Activity>;

  /**
   * Gets a list of activities with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets activities created by a specific user
   */
  getUserActivities(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets recommended activities based on user preferences/mood
   */
  getRecommendedActivities(
    page: number,
    pageSize: number
  ): Promise<{
    items: Activity[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Participate in an activity
   */
  participateInActivity(
    activityId: string,
    userId: string
  ): Promise<ActivityParticipation>;

  /**
   * Leave an activity
   */
  leaveActivity(activityId: string, userId: string): Promise<boolean>;
}
