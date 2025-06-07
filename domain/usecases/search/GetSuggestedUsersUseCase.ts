import { ISearchRepository } from "../../repositories/ISearchRepository";
import { IFollowRepository } from "../../repositories/IFollowRepository";
import { RecommendedUser } from "../../entities/RecommendedUser";

export class GetSuggestedUsersUseCase {
  constructor(
    private searchRepository: ISearchRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(
    currentUserId: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<RecommendedUser[]> {
    try {
      const response = await this.searchRepository.getSuggestedUsers(
        pageIndex,
        pageSize
      );

      // Sort by moodCompatibility descending (highest first)
      const sortedUsers = response.compatibleUsers.sort(
        (a, b) => b.moodCompatibility - a.moodCompatibility
      );

      // Check follow status for each user
      const usersWithFollowStatus = await Promise.all(
        sortedUsers.map(async (user) => {
          try {
            const followDetails = await this.followRepository.getFollowDetails(
              currentUserId,
              user.userId
            );
            return {
              ...user,
              isFollowing: followDetails.isFollowing,
              followId: followDetails.followId,
            };
          } catch (error) {
            console.error(
              `Failed to check follow status for user ${user.userId}:`,
              error
            );
            return {
              ...user,
              isFollowing: false,
              followId: undefined,
            };
          }
        })
      );

      return usersWithFollowStatus;
    } catch (error) {
      console.error("Failed to get suggested users:", error);
      throw new Error("Önerilen kullanıcılar alınırken bir hata oluştu");
    }
  }
}
