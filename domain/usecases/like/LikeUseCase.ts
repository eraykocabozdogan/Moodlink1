import { Like } from "../../entities/Like";
import { ILikeRepository } from "../../repositories/ILikeRepository";

export class LikeUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async likePost(userId: string, postId: string): Promise<Like> {
    if (!userId || !postId) {
      throw new Error("Kullanıcı ID'si ve Post ID'si gereklidir");
    }

    // Like entity'sini oluştur
    const like: Like = {
      id: "", // ID backend tarafından oluşturulacak
      userId,
      postId,
      createdDate: new Date(),
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.likeRepository.create(like);
  }

  async likeComment(userId: string, commentId: string): Promise<Like> {
    if (!userId || !commentId) {
      throw new Error("Kullanıcı ID'si ve Yorum ID'si gereklidir");
    }

    // Like entity'sini oluştur
    const like: Like = {
      id: "", // ID backend tarafından oluşturulacak
      userId,
      commentId,
      createdDate: new Date(),
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.likeRepository.create(like);
  }

  async unlikeEntity(likeId: string): Promise<boolean> {
    if (!likeId) {
      throw new Error("Like ID'si gereklidir");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.likeRepository.delete(likeId);
  }

  async getPostLikes(
    postId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }> {
    if (!postId) {
      throw new Error("Post ID'si gereklidir");
    }

    return this.likeRepository.getPostLikes(postId, page, pageSize);
  }

  async getCommentLikes(
    commentId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }> {
    if (!commentId) {
      throw new Error("Yorum ID'si gereklidir");
    }

    return this.likeRepository.getCommentLikes(commentId, page, pageSize);
  }
}
