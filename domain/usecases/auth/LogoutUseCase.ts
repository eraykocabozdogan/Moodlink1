import { IAuthRepository } from "../../repositories/IAuthRepository";
import { TokenService } from "@/common/services/TokenService";

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    try {
      // 1. Server'daki token'ı revoke et
      await this.authRepository.revokeToken();
    } catch (error) {
      // Server error'u ignore et, local token'ı sil
      console.warn("Token revocation failed on server:", error);
    }

    // 2. Local token'ı sil
    await TokenService.deleteToken();
  }
}
