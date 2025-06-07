import { MoodCompatibilityResult } from "../entities/MoodCompatibility";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

export interface IUserProfileRepository {
  /**
   * Get user basic information by ID
   */
  getUserById(userId: string): Promise<User>;

  /**
   * Get mood compatibility between current user and target user
   */
  getMoodCompatibility(targetUserId: string): Promise<MoodCompatibilityResult>;

  /**
   * Get user posts with pagination
   */
  getUserPosts(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }>;
}
