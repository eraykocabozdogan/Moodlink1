import { IUserRepository } from "../../repositories/IUserRepository";
import { UserProfile } from "../../entities/UserProfile";

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId?: string): Promise<UserProfile> {
    try {
      return await this.userRepository.getUserProfile(userId);
    } catch (error) {
      console.error("Failed to get user profile:", error);
      throw new Error("Kullanıcı profili alınırken bir hata oluştu");
    }
  }
}
