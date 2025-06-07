import { IUserProfileRepository } from "../../domain/repositories/IUserProfileRepository";
import { MoodCompatibilityResult } from "../../domain/entities/MoodCompatibility";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import UserApi from "../datasources/remote/UserApi";
import { UserMapper } from "../mappers/UserMapper";
import { PostMapper } from "../mappers/PostMapper";

export class UserProfileRepositoryImpl implements IUserProfileRepository {
  constructor(private userApi: typeof UserApi) {}

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await this.userApi.getById(userId);
      return UserMapper.toEntity(response);
    } catch (error) {
      console.error("Get user by ID failed:", error);
      throw new Error("Kullanıcı bilgileri alınamadı");
    }
  }

  async getMoodCompatibility(
    targetUserId: string
  ): Promise<MoodCompatibilityResult> {
    try {
      const response = await this.userApi.getMoodCompatibility(targetUserId);
      return response; // API response already matches our entity structure
    } catch (error) {
      console.error("Get mood compatibility failed:", error);
      throw new Error("Uyum analizi alınamadı");
    }
  }

  async getUserPosts(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await this.userApi.getUserPosts(
        userId,
        pageIndex,
        pageSize
      );

      return {
        items: response.items.map((item: any) =>
          PostMapper.listItemToEntity(item)
        ),
        totalCount: response.count,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
      };
    } catch (error) {
      console.error("Get user posts failed:", error);
      throw new Error("Kullanıcı gönderileri alınamadı");
    }
  }
}
