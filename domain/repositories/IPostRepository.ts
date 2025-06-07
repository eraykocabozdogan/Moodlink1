import { Post } from "../entities/Post";

/**
 * Repository interface for Post entity operations
 */
export interface IPostRepository {
  /**
   * Creates a new post
   */
  create(post: Post): Promise<Post>;

  /**
   * Updates an existing post
   */
  update(post: Post): Promise<Post>;

  /**
   * Deletes a post by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a post by ID
   */
  getById(id: string): Promise<Post>;

  /**
   * Gets a list of posts with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets posts from users that the specified user follows
   */
  getFollowedUsersPosts(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }>;
}
