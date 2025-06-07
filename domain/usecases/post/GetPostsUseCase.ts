import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async getPost(postId: string): Promise<Post> {
    if (!postId) {
      throw new Error("Post ID'si gereklidir");
    }

    return this.postRepository.getById(postId);
  }

  async getAllPosts(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    return this.postRepository.getList(page, pageSize);
  }

  async getFollowedUsersPosts(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    return this.postRepository.getFollowedUsersPosts(userId, page, pageSize);
  }
}
