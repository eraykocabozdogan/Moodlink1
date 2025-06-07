import { IPostRepository } from "../../repositories/IPostRepository";
import { Post } from "../../entities/Post";

export class GetFollowedUsersPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    return await this.postRepository.getFollowedUsersPosts(
      userId,
      page,
      pageSize
    );
  }
}
