import { ILikeRepository } from "../../repositories/ILikeRepository";

export class UnlikeCommentUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, commentId: string): Promise<boolean> {
    if (!userId || !commentId) {
      throw new Error("Kullanıcı ID'si ve Yorum ID'si gereklidir");
    }

    // This is not efficient as it fetches all likes for a comment.
    // A better approach would be a dedicated API endpoint.
    try {
      const existingLikes = await this.likeRepository.getCommentLikes(
        commentId,
        1,
        1000
      );
      const userLike = existingLikes.items.find(
        (like) => like.userId === userId
      );

      if (userLike && userLike.id) {
        return await this.likeRepository.delete(userLike.id);
      }

      return true;
    } catch (error) {
      console.error("Error in UnlikeCommentUseCase:", error);
      throw error;
    }
  }
}
