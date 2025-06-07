import { Comment } from "../entities/Comment";
import { GetCommentsUseCaseParams } from "../usecases/comment/GetCommentsUseCase";

/**
 * Repository interface for Comment entity operations
 */
export interface ICommentRepository {
  /**
   * Creates a new comment
   */
  create(comment: Comment): Promise<Comment>;

  /**
   * Updates an existing comment
   */
  update(comment: Comment): Promise<Comment>;

  /**
   * Deletes a comment by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a comment by ID
   */
  getById(id: string): Promise<Comment>;

  /**
   * Gets a list of comments with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Comment[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets comments for a specific post
   */
  getPostComments(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Comment[];
    totalCount: number;
    totalPages: number;
  }>;

  getComments(params: GetCommentsUseCaseParams): Promise<Comment[]>;
  addComment(comment: Comment): Promise<Comment>;
}
