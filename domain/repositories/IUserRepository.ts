import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";

/**
 * Repository interface for User entity operations
 */
export interface IUserRepository {
  /**
   * Creates a new user
   */
  create(user: User, password: string): Promise<User>;

  /**
   * Updates an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Updates the authenticated user
   */
  updateFromAuth(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a user by ID
   */
  getById(id: string): Promise<User>;

  /**
   * Gets the authenticated user's profile
   */
  getFromAuth(): Promise<User>;

  /**
   * Gets a list of users with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Searches users by query string
   */
  searchUsers(
    query: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets user profile with posts, mood values and badges
   */
  getUserProfile(userId?: string): Promise<UserProfile>;
}
