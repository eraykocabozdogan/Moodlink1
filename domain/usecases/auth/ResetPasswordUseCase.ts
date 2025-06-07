import { IAuthRepository } from "../../repositories/IAuthRepository";

export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async sendResetCode(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    if (!this.isValidEmail(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    return this.authRepository.sendPasswordResetCode(email);
  }

  async verifyResetCode(
    email: string,
    code: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    if (!this.isValidEmail(email) || !code) {
      throw new Error("Geçerli bir e-posta adresi ve kod giriniz");
    }

    return this.authRepository.verifyCode(code, email);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    if (!this.isValidEmail(email) || !code) {
      throw new Error("Geçerli bir e-posta adresi ve kod giriniz");
    }

    if (!this.isStrongPassword(newPassword)) {
      throw new Error(
        "Şifre en az 8 karakter olmalı ve özel karakterler içermelidir"
      );
    }

    return this.authRepository.resetPassword(email, code, newPassword);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isStrongPassword(password: string): boolean {
    // En az 8 karakter, en az bir büyük harf, bir küçük harf ve bir rakam
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }
}
