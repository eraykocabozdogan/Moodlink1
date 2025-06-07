import { IAuthRepository } from "@/core/domain/repositories/IAuthRepository";
import { User } from "@/core/domain/entities/User";
import AuthApi from "../datasources/remote/AuthApi";
import { TokenService } from "@/common/services/TokenService";
import { EnhancedUserForRegisterDto, UserForLoginDto } from "../dtos/AuthDto";
import { IUserRepository } from "@/core/domain/repositories/IUserRepository";

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private authApi: typeof AuthApi,
    private userRepository: IUserRepository
  ) {}

  async login(
    email: string,
    password: string,
    authenticatorCode?: string
  ): Promise<{ accessToken: string; user: User | null }> {
    const loginDto: UserForLoginDto = {
      email,
      password,
      authenticatorCode,
    };
    const responseDto = await this.authApi.login(loginDto);

    const accessToken = responseDto.accessToken.token;

    return {
      accessToken,
      user: null, // User is fetched separately in the ViewModel
    };
  }

  async register(
    user: Omit<User, "id" | "followers" | "following" | "createdDate">,
    password: string
  ): Promise<{ accessToken: string; user: User }> {
    const registerDto: EnhancedUserForRegisterDto = {
      ...user,
      password: password,
    };

    const responseDto = await this.authApi.register(registerDto);
    const accessToken = responseDto.accessToken.token;

    await TokenService.saveToken(accessToken);

    // The repository should call another repository or have its own logic,
    // but not a use case.
    const registeredUser = await this.userRepository.getFromAuth();

    if (!registeredUser) {
      throw new Error(
        "Registration succeeded, but failed to fetch user profile."
      );
    }

    return {
      accessToken,
      user: registeredUser,
    };
  }

  // Other methods from IAuthRepository need to be implemented here
  // For now, they can be stubs.
  async enableEmailAuthenticator(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async enableOtpAuthenticator(): Promise<{
    secretKey: string;
    qrCodeUrl: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async verifyEmailAuthenticator(
    userId: string,
    activationKey: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async verifyOtpAuthenticator(authenticatorCode: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async sendEmailValidation(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async sendPasswordResetCode(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async verifyCode(
    code: string,
    email: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async revokeToken(): Promise<void> {
    // Implement token revocation logic
    // await this.authApi.revokeToken();
    // For now, we'll just log that it's not implemented
    console.warn("Token revocation not implemented in API yet");
  }
}
