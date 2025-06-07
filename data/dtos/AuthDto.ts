// Auth Request DTOs
export interface UserForLoginDto {
  email: string;
  password: string;
  authenticatorCode?: string;
}

export interface UserForRegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface EnhancedUserForRegisterDto extends UserForRegisterDto {
  dateOfBirth?: Date;
  bio?: string;
}

export interface SendEmailValidationDto {
  email: string;
}

export interface SendPasswordResetCodeDto {
  email: string;
}

export interface VerifyCodeDto {
  code: string;
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  password: string;
}

// Auth Response DTOs
export interface LoggedResponseDto {
  accessToken: {
    token: string;
    expiration: Date;
  };
}

export interface RegisteredResponseDto {
  accessToken: {
    token: string;
    expiration: Date;
  };
}

export interface RefreshedTokensResponseDto {
  accessToken: {
    token: string;
    expiration: Date;
  };
}

export interface EnabledOtpAuthenticatorResponseDto {
  secretKey: string;
  qrCodeUrl: string;
}

export interface SendEmailValidationResponseDto {
  isSuccess: boolean;
  message: string;
}

export interface SendPasswordResetCodeResponseDto {
  isSuccess: boolean;
  message: string;
}

export interface VerifyCodeResponseDto {
  isSuccess: boolean;
  message: string;
}

export interface ResetPasswordResponseDto {
  isSuccess: boolean;
  message: string;
}
