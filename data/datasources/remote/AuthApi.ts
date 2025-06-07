import ApiService from "./ApiService";
import { API_ENDPOINTS } from "@/common/constants/api";
import {
  UserForLoginDto,
  LoggedResponseDto,
  EnhancedUserForRegisterDto,
  RegisteredResponseDto,
  RefreshedTokensResponseDto,
  SendPasswordResetCodeDto,
  SendPasswordResetCodeResponseDto,
  VerifyCodeDto,
  VerifyCodeResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  SendEmailValidationDto,
  SendEmailValidationResponseDto,
  EnabledOtpAuthenticatorResponseDto,
} from "../../dtos/AuthDto";

const AuthApi = {
  login: async (request: UserForLoginDto): Promise<LoggedResponseDto> => {
    const response = await ApiService.post<LoggedResponseDto>(
      API_ENDPOINTS.LOGIN,
      request
    );
    return response.data;
  },

  register: async (
    request: EnhancedUserForRegisterDto
  ): Promise<RegisteredResponseDto> => {
    const response = await ApiService.post<RegisteredResponseDto>(
      API_ENDPOINTS.REGISTER,
      request
    );
    return response.data;
  },

  sendPasswordResetCode: async (
    request: SendPasswordResetCodeDto
  ): Promise<SendPasswordResetCodeResponseDto> => {
    const response = await ApiService.post<SendPasswordResetCodeResponseDto>(
      API_ENDPOINTS.SEND_PASSWORD_RESET_CODE,
      request
    );
    return response.data;
  },

  verifyCode: async (
    request: VerifyCodeDto
  ): Promise<VerifyCodeResponseDto> => {
    const response = await ApiService.post<VerifyCodeResponseDto>(
      API_ENDPOINTS.VERIFY_CODE,
      request
    );
    return response.data;
  },

  resetPassword: async (
    request: ResetPasswordDto
  ): Promise<ResetPasswordResponseDto> => {
    const response = await ApiService.post<ResetPasswordResponseDto>(
      API_ENDPOINTS.RESET_PASSWORD,
      request
    );
    return response.data;
  },

  sendEmailValidation: async (
    request: SendEmailValidationDto
  ): Promise<SendEmailValidationResponseDto> => {
    const response = await ApiService.post<SendEmailValidationResponseDto>(
      API_ENDPOINTS.SEND_EMAIL_VALIDATION,
      request
    );
    return response.data;
  },

  enableEmailAuthenticator: async (): Promise<void> => {
    await ApiService.get(API_ENDPOINTS.ENABLE_EMAIL_AUTHENTICATOR);
  },

  enableOtpAuthenticator:
    async (): Promise<EnabledOtpAuthenticatorResponseDto> => {
      const response = await ApiService.get<EnabledOtpAuthenticatorResponseDto>(
        API_ENDPOINTS.ENABLE_OTP_AUTHENTICATOR
      );
      return response.data;
    },

  verifyEmailAuthenticator: async (activationKey: string): Promise<void> => {
    await ApiService.get(API_ENDPOINTS.VERIFY_EMAIL_AUTHENTICATOR, {
      params: { ActivationKey: activationKey },
    });
  },

  verifyOtpAuthenticator: async (authenticatorCode: string): Promise<void> => {
    // API spec says body is a string. Axios will wrap it in JSON.
    // Backend should be able to handle this.
    await ApiService.post(
      API_ENDPOINTS.VERIFY_OTP_AUTHENTICATOR,
      authenticatorCode
    );
  },
};

export default AuthApi;
