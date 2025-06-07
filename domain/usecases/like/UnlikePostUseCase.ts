import { ILikeRepository } from "../../repositories/ILikeRepository";

export class UnlikePostUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, postId: string): Promise<boolean> {
    if (!userId || !postId) {
      throw new Error("Kullanıcı ID'si ve Post ID'si gereklidir");
    }

    // This is not efficient as it fetches all likes for a post.
    // A better approach would be a dedicated API endpoint like /api/posts/{postId}/like [DELETE]
    // that finds and deletes the like based on the authenticated user.
    try {
      const existingLikes = await this.likeRepository.getPostLikes(
        postId,
        1,
        1000
      ); // Assuming max 1000 likes page
      const userLike = existingLikes.items.find(
        (like) => like.userId === userId
      );

      if (userLike && userLike.id) {
        return await this.likeRepository.delete(userLike.id);
      }

      // If userLike is not found, it might have been already unliked.
      // Returning true to signify the state is consistent.
      return true;
    } catch (error) {
      console.error("Error in UnlikePostUseCase:", error);
      // Decide if to re-throw or handle it. For now, re-throwing.
      throw error;
    }
  }
}
