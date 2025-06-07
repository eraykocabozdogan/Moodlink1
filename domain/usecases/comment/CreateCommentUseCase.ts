import { Comment } from "../../entities/Comment";
import { ICommentRepository } from "../../repositories/ICommentRepository";

export class CreateCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(
    userId: string,
    postId: string,
    content: string,
    parentCommentId?: string
  ): Promise<Comment> {
    // İş mantığı kontrolleri
    if (!userId || !postId) {
      throw new Error("Kullanıcı ID'si ve Post ID'si gereklidir");
    }

    if (!content.trim()) {
      throw new Error("Yorum içeriği boş olamaz");
    }

    if (content.length > 300) {
      throw new Error("Yorum içeriği 300 karakterden fazla olamaz");
    }

    // Comment entity'sini oluştur
    const comment: Comment = {
      id: "", // ID backend tarafından oluşturulacak
      userId,
      postId,
      content,
      parentCommentId,
      createdAt: new Date(),
      likes: 0,
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.commentRepository.create(comment);
  }
}
