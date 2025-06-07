import { ISearchRepository } from "../../repositories/ISearchRepository";
import { IFollowRepository } from "../../repositories/IFollowRepository";
import { SearchUser } from "../../entities/SearchResult";

export class SearchUsersUseCase {
  constructor(
    private searchRepository: ISearchRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(
    searchTerm: string,
    currentUserId: string,
    pageIndex: number = 0,
    pageSize: number = 20
  ): Promise<SearchUser[]> {
    if (!searchTerm.trim()) {
      return [];
    }

    try {
      const response = await this.searchRepository.searchUsers(
        searchTerm.trim(),
        pageIndex,
        pageSize
      );

      // Check follow status for each user
      const usersWithFollowStatus = await Promise.all(
        response.users.map(async (user) => {
          try {
            const followDetails = await this.followRepository.getFollowDetails(
              currentUserId,
              user.id
            );
            return {
              ...user,
              isFollowing: followDetails.isFollowing,
              followId: followDetails.followId,
            };
          } catch (error) {
            console.error(
              `Failed to check follow status for user ${user.id}:`,
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
      console.error("Failed to search users:", error);
      throw new Error("Kullanıcı arama sırasında bir hata oluştu");
    }
  }
}
