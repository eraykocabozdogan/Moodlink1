import { Post } from "../../entities/Post";
import { AnalysisStatus } from "../../../data/enums/AnalysisStatus";
import { IPostRepository } from "../../repositories/IPostRepository";

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(
    userId: string,
    contentText: string,
    imageFileId?: string
  ): Promise<Post> {
    // İş mantığı kontrolleri
    if (!contentText.trim() && !imageFileId) {
      throw new Error("Post içeriği veya görsel gereklidir");
    }

    if (contentText.length > 500) {
      throw new Error("Post içeriği 500 karakterden fazla olamaz");
    }

    // Post entity'sini oluştur
    const post: Post = {
      id: "", // ID backend tarafından oluşturulacak
      userId,
      user: {
        id: userId,
        userName: "",
        firstName: "",
        lastName: "",
      },
      contentText,
      createdDate: new Date(),
      analysisStatus: AnalysisStatus.Pending,
      likes: 0,
      comments: 0,
      // imageUrl bilgisi repository tarafından doldurulacak
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.postRepository.create(post);
  }
}
