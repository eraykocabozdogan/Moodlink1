import { Follow } from "../../entities/Follow";
import { IFollowRepository } from "../../repositories/IFollowRepository";

export class FollowUseCase {
  constructor(private followRepository: IFollowRepository) {}

  async followUser(followerId: string, followingId: string): Promise<Follow> {
    if (!followerId || !followingId) {
      throw new Error(
        "Takip eden ve takip edilen kullanıcı ID'leri gereklidir"
      );
    }

    if (followerId === followingId) {
      throw new Error("Kullanıcılar kendilerini takip edemezler");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.followRepository.followUser(followerId, followingId);
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    if (!followerId || !followingId) {
      throw new Error(
        "Takip eden ve takip edilen kullanıcı ID'leri gereklidir"
      );
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.followRepository.unfollowUser(followerId, followingId);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!followerId || !followingId) {
      throw new Error(
        "Takip eden ve takip edilen kullanıcı ID'leri gereklidir"
      );
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.followRepository.isFollowing(followerId, followingId);
  }
}
