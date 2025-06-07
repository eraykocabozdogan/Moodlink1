import { IUserProfileRepository } from "../../repositories/IUserProfileRepository";
import { IFollowRepository } from "../../repositories/IFollowRepository";
import { User } from "../../entities/User";
import { MoodCompatibilityResult } from "../../entities/MoodCompatibility";
import { Post } from "../../entities/Post";

export interface UserProfileData {
  user: User;
  moodCompatibility: MoodCompatibilityResult | null;
  posts: {
    items: Post[];
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  isFollowing: boolean;
  followId?: string;
}

export class GetUserProfileUseCase {
  constructor(
    private userProfileRepository: IUserProfileRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(
    targetUserId: string,
    currentUserId: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<UserProfileData> {
    try {
      // Get all data in parallel
      const [user, moodCompatibility, posts, followDetails] = await Promise.all(
        [
          this.userProfileRepository.getUserById(targetUserId),
          this.getMoodCompatibilityOrNull(targetUserId),
          this.userProfileRepository.getUserPosts(
            targetUserId,
            pageIndex,
            pageSize
          ),
          this.followRepository.getFollowDetails(currentUserId, targetUserId),
        ]
      );

      return {
        user,
        moodCompatibility,
        posts,
        isFollowing: followDetails.isFollowing,
        followId: followDetails.followId,
      };
    } catch (error) {
      console.error("Get user profile failed:", error);
      throw new Error("Kullanıcı profili yüklenemedi");
    }
  }

  private async getMoodCompatibilityOrNull(
    targetUserId: string
  ): Promise<MoodCompatibilityResult | null> {
    try {
      return await this.userProfileRepository.getMoodCompatibility(
        targetUserId
      );
    } catch (error) {
      console.warn("Mood compatibility could not be loaded:", error);
      return null;
    }
  }
}
