import { Follow } from "../entities/Follow";

/**
 * Repository interface for Follow entity operations
 */
export interface IFollowRepository {
  /**
   * Follows a user
   */
  followUser(followerId: string, followedUserId: string): Promise<Follow>;

  /**
   * Unfollows a user
   */
  unfollowUser(followerId: string, followedUserId: string): Promise<boolean>;

  /**
   * Checks if the current user is following a specific user
   */
  isFollowing(userId: string, followedUserId: string): Promise<boolean>;

  /**
   * Gets follow details including follow ID
   */
  getFollowDetails(
    userId: string,
    followedUserId: string
  ): Promise<{ isFollowing: boolean; followId?: string }>;

  /**
   * Unfollows a user using follow ID
   */
  unfollowById(followId: string): Promise<boolean>;
}
