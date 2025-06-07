import { IAuthRepository } from "../../repositories/IAuthRepository";
import { TokenService } from "@/common/services/TokenService";

export class TokenManagementUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async logout(): Promise<void> {
    try {
      // 1. Backend'deki token'ı geçersiz kılmayı dene
      await this.authRepository.revokeToken();
    } catch (error) {
      console.error(
        "Token revoke edilirken hata oluştu, yine de çıkış yapılıyor.",
        error
      );
      // Backend'e ulaşılamasa bile client-side logout devam etmeli
    } finally {
      // 2. Client'daki token'ı güvenli depodan sil
      await TokenService.deleteToken();
      // 3. (ViewModel katmanında) Hafızadaki kullanıcı state'ini temizle
    }
  }
}
