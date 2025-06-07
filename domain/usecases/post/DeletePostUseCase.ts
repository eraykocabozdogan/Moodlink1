import { IPostRepository } from "../../repositories/IPostRepository";

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(postId: string): Promise<boolean> {
    if (!postId) {
      throw new Error("Post ID'si gereklidir");
    }

    return this.postRepository.delete(postId);
  }
}
