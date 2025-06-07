import { IAuthRepository } from "../../repositories/IAuthRepository";
import { User } from "../../entities/User";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    email: string,
    password: string,
    authenticatorCode?: string
  ): Promise<{ accessToken: string; user: User | null }> {
    // İş mantığı kontrolleri
    if (!email || !password) {
      throw new Error("E-posta ve şifre alanları zorunludur");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return await this.authRepository.login(email, password, authenticatorCode);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
