import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { Follow } from "../../domain/entities/Follow";
import FollowApi from "../datasources/remote/FollowApi";
import UserApi from "../datasources/remote/UserApi";
import { FollowMapper } from "../mappers/FollowMapper";

export class FollowRepositoryImpl implements IFollowRepository {
  constructor(
    private followApi: typeof FollowApi,
    private userApi: typeof UserApi
  ) {}

  async followUser(
    followerId: string,
    followedUserId: string
  ): Promise<Follow> {
    const response = await this.followApi.followUser(
      followerId,
      followedUserId
    );
    return FollowMapper.toEntity(response);
  }

  async unfollowUser(
    followerId: string,
    followedUserId: string
  ): Promise<boolean> {
    try {
      await this.followApi.unfollowUser(followerId, followedUserId);
      return true;
    } catch (error) {
      console.error("Unfollow user failed:", error);
      return false;
    }
  }

  async isFollowing(userId: string, followedUserId: string): Promise<boolean> {
    try {
      const result = await this.userApi.checkIfFollowing(
        userId,
        followedUserId
      );
      return result.isFollowing;
    } catch (error) {
      console.error("Check if following failed:", error);
      return false;
    }
  }

  // Method to get follow details including follow ID
  async getFollowDetails(
    userId: string,
    followedUserId: string
  ): Promise<{ isFollowing: boolean; followId?: string }> {
    try {
      return await this.userApi.checkIfFollowing(userId, followedUserId);
    } catch (error) {
      console.error("Get follow details failed:", error);
      return { isFollowing: false };
    }
  }

  // Method to unfollow using follow ID
  async unfollowById(followId: string): Promise<boolean> {
    try {
      await this.followApi.delete(followId);
      return true;
    } catch (error) {
      console.error("Unfollow by ID failed:", error);
      return false;
    }
  }
}
