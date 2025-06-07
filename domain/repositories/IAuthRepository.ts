import { User } from "../entities/User";

/**
 * Repository interface for authentication operations
 */
export interface IAuthRepository {
  /**
   * Login with email and password
   */
  login(
    email: string,
    password: string,
    authenticatorCode?: string
  ): Promise<{
    accessToken: string;
    user: User | null;
  }>;

  /**
   * Register a new user
   */
  register(
    user: Omit<User, "id" | "followers" | "following" | "createdDate">,
    password: string
  ): Promise<{
    accessToken: string;
    user: User;
  }>;

  /**
   * Revoke the current access token
   */
  revokeToken(): Promise<void>;

  /**
   * Enable email authenticator for two-factor authentication
   */
  enableEmailAuthenticator(): Promise<boolean>;

  /**
   * Enable OTP authenticator for two-factor authentication
   */
  enableOtpAuthenticator(): Promise<{
    secretKey: string;
    qrCodeUrl: string;
  }>;

  /**
   * Verify the email authenticator
   */
  verifyEmailAuthenticator(
    userId: string,
    activationKey: string
  ): Promise<boolean>;

  /**
   * Verify the OTP authenticator
   */
  verifyOtpAuthenticator(authenticatorCode: string): Promise<boolean>;

  /**
   * Send email validation code
   */
  sendEmailValidation(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }>;

  /**
   * Send password reset code
   */
  sendPasswordResetCode(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }>;

  /**
   * Verify a validation code
   */
  verifyCode(
    code: string,
    email: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }>;

  /**
   * Reset the password using a validation code
   */
  resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }>;
}
