import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserProfile } from "../../domain/entities/UserProfile";
import UserApi from "../datasources/remote/UserApi";
import { UserMapper } from "../mappers/UserMapper";

export class UserRepositoryImpl implements IUserRepository {
  constructor(private userApi: typeof UserApi) {}

  async getById(id: string): Promise<User> {
    const response = await this.userApi.getById(id);
    return UserMapper.toEntity(response);
  }

  async getFromAuth(): Promise<User> {
    const response = await this.userApi.getFromAuth();
    return UserMapper.fromAuthToEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await this.userApi.getList({
      pageIndex: page,
      pageSize: pageSize,
    });
    return {
      items: response.items.map(UserMapper.listItemToEntity),
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pageSize),
    };
  }

  async create(user: User, password: string): Promise<User> {
    const dto = {
      ...user,
      password: password,
    };
    const response = await this.userApi.create(dto);
    return UserMapper.toEntity(response);
  }

  async update(user: User): Promise<User> {
    const dto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const response = await this.userApi.update(dto);
    return UserMapper.toEntity(response);
  }

  async updateFromAuth(user: User): Promise<User> {
    const dto = {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
    };
    const response = await this.userApi.updateFromAuth(dto);
    return UserMapper.toEntity(response);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.userApi.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async searchUsers(
    query: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
  }> {
    // API'de search endpoint'i varsa burada implement edilecek
    // Şimdilik boş list döndürüyoruz
    return {
      items: [],
      totalCount: 0,
      totalPages: 0,
    };
  }

  async getUserProfile(userId?: string): Promise<UserProfile> {
    try {
      const response = await this.userApi.getUserProfile(userId);

      // Mock data structure for now - should be mapped from API response
      const profile: UserProfile = {
        ...UserMapper.toEntity(response.user || response),
        moodValues: response.moodValues || [
          { emotionType: 1, score: 62, emotionName: "Energetic" },
          { emotionType: 2, score: 56, emotionName: "Sad" },
        ],
        badges: response.badges || [],
        posts: response.posts || [],
        postsCount: response.postsCount || 0,
      };

      return profile;
    } catch (error) {
      console.error("Failed to get user profile:", error);
      throw error;
    }
  }
}
