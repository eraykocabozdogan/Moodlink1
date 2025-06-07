import { Like } from "../entities/Like";

/**
 * Repository interface for Like entity operations
 */
export interface ILikeRepository {
  /**
   * Creates a new like (for post or comment)
   */
  create(like: Like): Promise<Like>;

  /**
   * Deletes a like by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a like by ID
   */
  getById(id: string): Promise<Like>;

  /**
   * Gets a list of likes with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets likes for a specific post
   */
  getPostLikes(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets likes for a specific comment
   */
  getCommentLikes(
    commentId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;
}
