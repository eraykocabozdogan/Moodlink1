import { Comment } from "../../entities/Comment";
import { ICommentRepository } from "../../repositories/ICommentRepository";

export interface GetCommentsUseCaseParams {
  postId: string;
}

export class GetCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(params: GetCommentsUseCaseParams): Promise<Comment[]> {
    if (!params.postId) {
      throw new Error("Post ID'si gereklidir");
    }
    return this.commentRepository.getComments(params);
  }
}
