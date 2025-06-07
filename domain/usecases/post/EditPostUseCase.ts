import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class EditPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(
    postId: string,
    contentText: string,
    imageFileId?: string
  ): Promise<Post> {
    if (!postId) {
      throw new Error("Post ID'si gereklidir");
    }

    // İş mantığı kontrolleri
    if (!contentText.trim() && !imageFileId) {
      throw new Error("Post içeriği veya görsel gereklidir");
    }

    if (contentText.length > 500) {
      throw new Error("Post içeriği 500 karakterden fazla olamaz");
    }

    // Önce mevcut post'u al
    const existingPost = await this.postRepository.getById(postId);

    // Post entity'sini güncelle
    const updatedPost: Post = {
      ...existingPost,
      contentText,
      // imageUrl bilgisi repository tarafından güncellenecek
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.postRepository.update(updatedPost);
  }
}
