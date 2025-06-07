import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  // Types
  UUID,
  PaginationParams,
  ApiResponse,
  
  // Activity Types
  CreateActivityCommand,
  CreatedActivityResponse,
  UpdateActivityCommand,
  UpdatedActivityResponse,
  DeletedActivityResponse,
  GetByIdActivityResponse,
  GetListActivityListItemDtoGetListResponse,
  UserActivityListItemDtoGetListResponse,
  UserActivityStatsResponse,
  
  // Activity Participation Types
  CreateActivityParticipationCommand,
  CreatedActivityParticipationResponse,
  UpdateActivityParticipationCommand,
  UpdatedActivityParticipationResponse,
  DeletedActivityParticipationResponse,
  GetByIdActivityParticipationResponse,
  GetListActivityParticipationListItemDtoGetListResponse,
  
  // AI Test Types
  AiTestResponse,
  CreateTestPostResponse,
  PostAnalysisCheckResponse,
  UserMoodCheckResponse,
  UpdateUserMoodResponse,
  EmotionTypesResponse,
  TestExamplesResponse,
  
  // Auth Types
  UserForLoginDto,
  EnhancedUserForRegisterDto,
  SendEmailValidationCommand,
  SendPasswordResetCodeCommand,
  VerifyCodeCommand,
  ResetPasswordCommand,
  
  // Badge Types
  CreateBadgeCommand,
  CreatedBadgeResponse,
  UpdateBadgeCommand,
  UpdatedBadgeResponse,
  DeletedBadgeResponse,
  GetByIdBadgeResponse,
  GetListBadgeListItemDtoGetListResponse,
  
  // Chat Types
  CreateChatCommand,
  CreateChatResponse,
  UpdateChatCommand,
  UpdatedChatResponse,
  DeletedChatResponse,
  GetByIdChatResponse,
  GetListChatListItemDtoGetListResponse,
  GetUserChatsResponse,
  
  // Chat Participant Types
  CreateChatParticipantCommand,
  CreatedChatParticipantResponse,
  UpdateChatParticipantCommand,
  UpdatedChatParticipantResponse,
  DeletedChatParticipantResponse,
  GetByIdChatParticipantResponse,
  GetListChatParticipantListItemDtoGetListResponse,
  
  // Comment Types
  CreateCommentCommand,
  CreatedCommentResponse,
  UpdateCommentCommand,
  UpdatedCommentResponse,
  DeletedCommentResponse,
  GetByIdCommentResponse,
  
  // Emotion Score Types
  CreateEmotionScoreCommand,
  CreatedEmotionScoreResponse,
  UpdateEmotionScoreCommand,
  UpdatedEmotionScoreResponse,
  DeletedEmotionScoreResponse,
  GetByIdEmotionScoreResponse,
  
  // Follow Types
  CreateFollowCommand,
  CreatedFollowResponse,
  DeletedFollowResponse,
  GetByIdFollowResponse,
  GetListFollowListItemDtoGetListResponse,
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  
  // Like Types
  CreateLikeCommand,
  CreatedLikeResponse,
  DeletedLikeResponse,
  GetByIdLikeResponse,
  
  // Message Types
  CreateMessageCommand,
  CreatedMessageResponse,
  UpdateMessageCommand,
  UpdatedMessageResponse,
  DeletedMessageResponse,
  GetByIdMessageResponse,
  GetChatMessagesResponse,
  
  // Notification Types
  CreateNotificationCommand,
  CreatedNotificationResponse,
  UpdateNotificationCommand,
  UpdatedNotificationResponse,
  DeletedNotificationResponse,
  GetByIdNotificationResponse,
  GetListNotificationListItemDtoGetListResponse,
  GetUserNotificationsResponse,
  
  // Post Types
  CreatePostCommand,
  CreatedPostResponse,
  UpdatePostCommand,
  UpdatedPostResponse,
  DeletedPostResponse,
  GetByIdPostResponse,
  GetListPostListItemDtoGetListResponse,
  GetUserPostsResponse,
  GetFeedPostsResponse,
  
  // Search Types
  SearchUsersAndPostsResponse,
  
  // User Types
  CreateUserCommand,
  UpdateUserCommand,
  UpdateUserFromAuthCommand,
  DeleteUserCommand,
  GetByIdUserResponse,
  GetListUserListItemDtoGetListResponse,
  
  // User Badge Types
  CreateUserBadgeCommand,
  CreatedUserBadgeResponse,
  UpdateUserBadgeCommand,
  UpdatedUserBadgeResponse,
  DeletedUserBadgeResponse,
  GetByIdUserBadgeResponse,
  GetListUserBadgeListItemDtoGetListResponse,
  
  // User Preference Types
  CreateUserPreferenceCommand,
  CreatedUserPreferenceResponse,
  UpdateUserPreferenceCommand,
  UpdatedUserPreferenceResponse,
  DeletedUserPreferenceResponse,
  GetByIdUserPreferenceResponse,
  GetListUserPreferenceListItemDtoGetListResponse,
  
  // Operation Claim Types
  CreateOperationClaimCommand,
  CreateUserOperationClaimCommand,
  UpdateUserOperationClaimCommand,
  DeleteUserOperationClaimCommand,
  
  // Validation Code Types
  CreateValidationCodeCommand,
  
  // Mail Log Types
  CreateMailLogCommand,
} from './types/api';

// API Client Configuration
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Default configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.moodlink.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    this.axiosInstance = axios.create({
      baseURL: finalConfig.baseURL,
      timeout: finalConfig.timeout,
      headers: finalConfig.headers,
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearAuthToken();
          // You can add redirect to login logic here
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth token management
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Activities API
  async createActivity(data: CreateActivityCommand): Promise<CreatedActivityResponse> {
    return this.request<CreatedActivityResponse>({
      method: 'POST',
      url: '/api/Activities',
      data,
    });
  }

  async updateActivity(data: UpdateActivityCommand, requestingUserId?: UUID): Promise<UpdatedActivityResponse> {
    return this.request<UpdatedActivityResponse>({
      method: 'PUT',
      url: '/api/Activities',
      data,
      params: requestingUserId ? { requestingUserId } : undefined,
    });
  }

  async getActivities(params?: PaginationParams): Promise<GetListActivityListItemDtoGetListResponse> {
    return this.request<GetListActivityListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Activities',
      params,
    });
  }

  async deleteActivity(id: UUID, requestingUserId?: UUID): Promise<DeletedActivityResponse> {
    return this.request<DeletedActivityResponse>({
      method: 'DELETE',
      url: `/api/Activities/${id}`,
      params: requestingUserId ? { requestingUserId } : undefined,
    });
  }

  async getActivityById(id: UUID): Promise<GetByIdActivityResponse> {
    return this.request<GetByIdActivityResponse>({
      method: 'GET',
      url: `/api/Activities/${id}`,
    });
  }

  async getUserCreatedActivities(userId: UUID, params?: PaginationParams): Promise<UserActivityListItemDtoGetListResponse> {
    return this.request<UserActivityListItemDtoGetListResponse>({
      method: 'GET',
      url: `/api/Activities/user/${userId}/created`,
      params,
    });
  }

  async getUserParticipatedActivities(userId: UUID, params?: PaginationParams): Promise<UserActivityListItemDtoGetListResponse> {
    return this.request<UserActivityListItemDtoGetListResponse>({
      method: 'GET',
      url: `/api/Activities/user/${userId}/participated`,
      params,
    });
  }

  async getUserActivityStats(userId: UUID): Promise<UserActivityStatsResponse> {
    return this.request<UserActivityStatsResponse>({
      method: 'GET',
      url: `/api/Activities/user/${userId}/stats`,
    });
  }

  // Activity Participations API
  async createActivityParticipation(data: CreateActivityParticipationCommand): Promise<CreatedActivityParticipationResponse> {
    return this.request<CreatedActivityParticipationResponse>({
      method: 'POST',
      url: '/api/ActivityParticipations',
      data,
    });
  }

  async updateActivityParticipation(data: UpdateActivityParticipationCommand): Promise<UpdatedActivityParticipationResponse> {
    return this.request<UpdatedActivityParticipationResponse>({
      method: 'PUT',
      url: '/api/ActivityParticipations',
      data,
    });
  }

  async getActivityParticipations(params?: PaginationParams): Promise<GetListActivityParticipationListItemDtoGetListResponse> {
    return this.request<GetListActivityParticipationListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/ActivityParticipations',
      params,
    });
  }

  async deleteActivityParticipation(id: UUID): Promise<DeletedActivityParticipationResponse> {
    return this.request<DeletedActivityParticipationResponse>({
      method: 'DELETE',
      url: `/api/ActivityParticipations/${id}`,
    });
  }

  async getActivityParticipationById(id: UUID): Promise<GetByIdActivityParticipationResponse> {
    return this.request<GetByIdActivityParticipationResponse>({
      method: 'GET',
      url: `/api/ActivityParticipations/${id}`,
    });
  }

  // AI Test API
  async testChatGPT(text: string): Promise<AiTestResponse> {
    return this.request<AiTestResponse>({
      method: 'POST',
      url: '/api/AiTest/test-chatgpt',
      data: text,
    });
  }

  async createTestPost(text: string): Promise<CreateTestPostResponse> {
    return this.request<CreateTestPostResponse>({
      method: 'POST',
      url: '/api/AiTest/create-test-post',
      data: text,
    });
  }

  async checkPostAnalysis(postId: UUID): Promise<PostAnalysisCheckResponse> {
    return this.request<PostAnalysisCheckResponse>({
      method: 'GET',
      url: `/api/AiTest/check-post-analysis/${postId}`,
    });
  }

  async checkUserMood(userId: UUID): Promise<UserMoodCheckResponse> {
    return this.request<UserMoodCheckResponse>({
      method: 'GET',
      url: `/api/AiTest/check-user-mood/${userId}`,
    });
  }

  async updateTestUserMood(): Promise<UpdateUserMoodResponse> {
    return this.request<UpdateUserMoodResponse>({
      method: 'POST',
      url: '/api/AiTest/update-test-user-mood',
    });
  }

  async getEmotionTypes(): Promise<EmotionTypesResponse> {
    return this.request<EmotionTypesResponse>({
      method: 'GET',
      url: '/api/AiTest/emotion-types',
    });
  }

  async getTestExamples(): Promise<TestExamplesResponse> {
    return this.request<TestExamplesResponse>({
      method: 'GET',
      url: '/api/AiTest/test-examples',
    });
  }

  // Auth API
  async login(data: UserForLoginDto): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/Login',
      data,
    });
  }

  async register(data: EnhancedUserForRegisterDto): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/Register',
      data,
    });
  }

  async refreshToken(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/Auth/RefreshToken',
    });
  }

  async revokeToken(token: string): Promise<any> {
    return this.request<any>({
      method: 'PUT',
      url: '/api/Auth/RevokeToken',
      data: token,
    });
  }

  async enableEmailAuthenticator(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/Auth/EnableEmailAuthenticator',
    });
  }

  async enableOtpAuthenticator(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/Auth/EnableOtpAuthenticator',
    });
  }

  async verifyEmailAuthenticator(activationKey?: string): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/Auth/VerifyEmailAuthenticator',
      params: activationKey ? { ActivationKey: activationKey } : undefined,
    });
  }

  async verifyOtpAuthenticator(code: string): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/VerifyOtpAuthenticator',
      data: code,
    });
  }

  async sendEmailValidation(data: SendEmailValidationCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/SendEmailValidation',
      data,
    });
  }

  async sendPasswordResetCode(data: SendPasswordResetCodeCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/SendPasswordResetCode',
      data,
    });
  }

  async verifyCode(data: VerifyCodeCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/VerifyCode',
      data,
    });
  }

  async resetPassword(data: ResetPasswordCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Auth/ResetPassword',
      data,
    });
  }

  // Badges API
  async createBadge(data: CreateBadgeCommand): Promise<CreatedBadgeResponse> {
    return this.request<CreatedBadgeResponse>({
      method: 'POST',
      url: '/api/Badges',
      data,
    });
  }

  async updateBadge(data: UpdateBadgeCommand): Promise<UpdatedBadgeResponse> {
    return this.request<UpdatedBadgeResponse>({
      method: 'PUT',
      url: '/api/Badges',
      data,
    });
  }

  async getBadges(params?: PaginationParams): Promise<GetListBadgeListItemDtoGetListResponse> {
    return this.request<GetListBadgeListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Badges',
      params,
    });
  }

  async deleteBadge(id: UUID): Promise<DeletedBadgeResponse> {
    return this.request<DeletedBadgeResponse>({
      method: 'DELETE',
      url: `/api/Badges/${id}`,
    });
  }

  async getBadgeById(id: UUID): Promise<GetByIdBadgeResponse> {
    return this.request<GetByIdBadgeResponse>({
      method: 'GET',
      url: `/api/Badges/${id}`,
    });
  }

  // Chat Participants API
  async createChatParticipant(data: CreateChatParticipantCommand): Promise<CreatedChatParticipantResponse> {
    return this.request<CreatedChatParticipantResponse>({
      method: 'POST',
      url: '/api/ChatParticipants',
      data,
    });
  }

  async updateChatParticipant(data: UpdateChatParticipantCommand): Promise<UpdatedChatParticipantResponse> {
    return this.request<UpdatedChatParticipantResponse>({
      method: 'PUT',
      url: '/api/ChatParticipants',
      data,
    });
  }

  async getChatParticipants(params?: PaginationParams): Promise<GetListChatParticipantListItemDtoGetListResponse> {
    return this.request<GetListChatParticipantListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/ChatParticipants',
      params,
    });
  }

  async deleteChatParticipant(id: UUID): Promise<DeletedChatParticipantResponse> {
    return this.request<DeletedChatParticipantResponse>({
      method: 'DELETE',
      url: `/api/ChatParticipants/${id}`,
    });
  }

  async getChatParticipantById(id: UUID): Promise<GetByIdChatParticipantResponse> {
    return this.request<GetByIdChatParticipantResponse>({
      method: 'GET',
      url: `/api/ChatParticipants/${id}`,
    });
  }

  // Chats API
  async createChat(data: CreateChatCommand): Promise<CreateChatResponse> {
    return this.request<CreateChatResponse>({
      method: 'POST',
      url: '/api/Chats/create',
      data,
    });
  }

  async getUserChats(params?: PaginationParams): Promise<GetUserChatsResponse> {
    return this.request<GetUserChatsResponse>({
      method: 'GET',
      url: '/api/Chats/user-chats',
      params,
    });
  }

  async updateChat(data: UpdateChatCommand): Promise<UpdatedChatResponse> {
    return this.request<UpdatedChatResponse>({
      method: 'PUT',
      url: '/api/Chats',
      data,
    });
  }

  async getChats(params?: PaginationParams): Promise<GetListChatListItemDtoGetListResponse> {
    return this.request<GetListChatListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Chats',
      params,
    });
  }

  async deleteChat(id: UUID): Promise<DeletedChatResponse> {
    return this.request<DeletedChatResponse>({
      method: 'DELETE',
      url: `/api/Chats/${id}`,
    });
  }

  async getChatById(id: UUID): Promise<GetByIdChatResponse> {
    return this.request<GetByIdChatResponse>({
      method: 'GET',
      url: `/api/Chats/${id}`,
    });
  }

  // Comments API
  async createComment(data: CreateCommentCommand): Promise<CreatedCommentResponse> {
    return this.request<CreatedCommentResponse>({
      method: 'POST',
      url: '/api/Comments',
      data,
    });
  }

  async updateComment(data: UpdateCommentCommand): Promise<UpdatedCommentResponse> {
    return this.request<UpdatedCommentResponse>({
      method: 'PUT',
      url: '/api/Comments',
      data,
    });
  }

  async deleteComment(id: UUID): Promise<DeletedCommentResponse> {
    return this.request<DeletedCommentResponse>({
      method: 'DELETE',
      url: `/api/Comments/${id}`,
    });
  }

  async getCommentById(id: UUID): Promise<GetByIdCommentResponse> {
    return this.request<GetByIdCommentResponse>({
      method: 'GET',
      url: `/api/Comments/${id}`,
    });
  }

  // Emotion Scores API
  async createEmotionScore(data: CreateEmotionScoreCommand): Promise<CreatedEmotionScoreResponse> {
    return this.request<CreatedEmotionScoreResponse>({
      method: 'POST',
      url: '/api/EmotionScores',
      data,
    });
  }

  async updateEmotionScore(data: UpdateEmotionScoreCommand): Promise<UpdatedEmotionScoreResponse> {
    return this.request<UpdatedEmotionScoreResponse>({
      method: 'PUT',
      url: '/api/EmotionScores',
      data,
    });
  }

  async deleteEmotionScore(id: UUID): Promise<DeletedEmotionScoreResponse> {
    return this.request<DeletedEmotionScoreResponse>({
      method: 'DELETE',
      url: `/api/EmotionScores/${id}`,
    });
  }

  async getEmotionScoreById(id: UUID): Promise<GetByIdEmotionScoreResponse> {
    return this.request<GetByIdEmotionScoreResponse>({
      method: 'GET',
      url: `/api/EmotionScores/${id}`,
    });
  }

  // Follows API
  async createFollow(data: CreateFollowCommand): Promise<CreatedFollowResponse> {
    return this.request<CreatedFollowResponse>({
      method: 'POST',
      url: '/api/Follows',
      data,
    });
  }

  async deleteFollow(id: UUID): Promise<DeletedFollowResponse> {
    return this.request<DeletedFollowResponse>({
      method: 'DELETE',
      url: `/api/Follows/${id}`,
    });
  }

  async getFollowById(id: UUID): Promise<GetByIdFollowResponse> {
    return this.request<GetByIdFollowResponse>({
      method: 'GET',
      url: `/api/Follows/${id}`,
    });
  }

  async getFollows(params?: PaginationParams): Promise<GetListFollowListItemDtoGetListResponse> {
    return this.request<GetListFollowListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Follows',
      params,
    });
  }

  // Likes API
  async createLike(data: CreateLikeCommand): Promise<CreatedLikeResponse> {
    return this.request<CreatedLikeResponse>({
      method: 'POST',
      url: '/api/Likes',
      data,
    });
  }

  async deleteLike(id: UUID): Promise<DeletedLikeResponse> {
    return this.request<DeletedLikeResponse>({
      method: 'DELETE',
      url: `/api/Likes/${id}`,
    });
  }

  async getLikeById(id: UUID): Promise<GetByIdLikeResponse> {
    return this.request<GetByIdLikeResponse>({
      method: 'GET',
      url: `/api/Likes/${id}`,
    });
  }

  // Messages API
  async createMessage(data: CreateMessageCommand): Promise<CreatedMessageResponse> {
    return this.request<CreatedMessageResponse>({
      method: 'POST',
      url: '/api/Messages',
      data,
    });
  }

  async updateMessage(data: UpdateMessageCommand): Promise<UpdatedMessageResponse> {
    return this.request<UpdatedMessageResponse>({
      method: 'PUT',
      url: '/api/Messages',
      data,
    });
  }

  async deleteMessage(id: UUID): Promise<DeletedMessageResponse> {
    return this.request<DeletedMessageResponse>({
      method: 'DELETE',
      url: `/api/Messages/${id}`,
    });
  }

  async getMessageById(id: UUID): Promise<GetByIdMessageResponse> {
    return this.request<GetByIdMessageResponse>({
      method: 'GET',
      url: `/api/Messages/${id}`,
    });
  }

  async getChatMessages(chatId: UUID, params?: PaginationParams): Promise<GetChatMessagesResponse> {
    return this.request<GetChatMessagesResponse>({
      method: 'GET',
      url: `/api/Messages/chat/${chatId}`,
      params,
    });
  }

  // Notifications API
  async createNotification(data: CreateNotificationCommand): Promise<CreatedNotificationResponse> {
    return this.request<CreatedNotificationResponse>({
      method: 'POST',
      url: '/api/Notifications',
      data,
    });
  }

  async updateNotification(data: UpdateNotificationCommand): Promise<UpdatedNotificationResponse> {
    return this.request<UpdatedNotificationResponse>({
      method: 'PUT',
      url: '/api/Notifications',
      data,
    });
  }

  async deleteNotification(id: UUID): Promise<DeletedNotificationResponse> {
    return this.request<DeletedNotificationResponse>({
      method: 'DELETE',
      url: `/api/Notifications/${id}`,
    });
  }

  async getNotificationById(id: UUID): Promise<GetByIdNotificationResponse> {
    return this.request<GetByIdNotificationResponse>({
      method: 'GET',
      url: `/api/Notifications/${id}`,
    });
  }

  async getNotifications(params?: PaginationParams): Promise<GetListNotificationListItemDtoGetListResponse> {
    return this.request<GetListNotificationListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Notifications',
      params,
    });
  }

  async getUserNotifications(): Promise<GetUserNotificationsResponse> {
    return this.request<GetUserNotificationsResponse>({
      method: 'GET',
      url: '/api/Notifications/user',
    });
  }

  async markNotificationAsRead(id: UUID): Promise<UpdatedNotificationResponse> {
    return this.request<UpdatedNotificationResponse>({
      method: 'PUT',
      url: `/api/Notifications/${id}/read`,
    });
  }

  async markAllNotificationsAsRead(): Promise<any> {
    return this.request<any>({
      method: 'PUT',
      url: '/api/Notifications/mark-all-read',
    });
  }

  // Posts API
  async createPost(data: CreatePostCommand): Promise<CreatedPostResponse> {
    return this.request<CreatedPostResponse>({
      method: 'POST',
      url: '/api/Posts',
      data,
    });
  }

  async updatePost(data: UpdatePostCommand): Promise<UpdatedPostResponse> {
    return this.request<UpdatedPostResponse>({
      method: 'PUT',
      url: '/api/Posts',
      data,
    });
  }

  async deletePost(id: UUID): Promise<DeletedPostResponse> {
    return this.request<DeletedPostResponse>({
      method: 'DELETE',
      url: `/api/Posts/${id}`,
    });
  }

  async getPostById(id: UUID): Promise<GetByIdPostResponse> {
    return this.request<GetByIdPostResponse>({
      method: 'GET',
      url: `/api/Posts/${id}`,
    });
  }

  async getPosts(params?: PaginationParams): Promise<GetListPostListItemDtoGetListResponse> {
    return this.request<GetListPostListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Posts',
      params,
    });
  }

  async getUserPosts(userId: UUID, params?: PaginationParams): Promise<GetUserPostsResponse> {
    return this.request<GetUserPostsResponse>({
      method: 'GET',
      url: `/api/Posts/user/${userId}`,
      params,
    });
  }

  async getFeedPosts(params?: PaginationParams): Promise<GetFeedPostsResponse> {
    return this.request<GetFeedPostsResponse>({
      method: 'GET',
      url: '/api/Posts/feed',
      params,
    });
  }

  async getPostComments(postId: UUID, params?: PaginationParams): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: `/api/Posts/${postId}/comments`,
      params,
    });
  }

  // Search API
  async searchUsersAndPosts(query: string, params?: PaginationParams): Promise<SearchUsersAndPostsResponse> {
    return this.request<SearchUsersAndPostsResponse>({
      method: 'GET',
      url: '/api/Search',
      params: { ...params, query },
    });
  }

  // User Badges API
  async createUserBadge(data: CreateUserBadgeCommand): Promise<CreatedUserBadgeResponse> {
    return this.request<CreatedUserBadgeResponse>({
      method: 'POST',
      url: '/api/UserBadges',
      data,
    });
  }

  async updateUserBadge(data: UpdateUserBadgeCommand): Promise<UpdatedUserBadgeResponse> {
    return this.request<UpdatedUserBadgeResponse>({
      method: 'PUT',
      url: '/api/UserBadges',
      data,
    });
  }

  async getUserBadges(params?: PaginationParams): Promise<GetListUserBadgeListItemDtoGetListResponse> {
    return this.request<GetListUserBadgeListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/UserBadges',
      params,
    });
  }

  async deleteUserBadge(id: UUID): Promise<DeletedUserBadgeResponse> {
    return this.request<DeletedUserBadgeResponse>({
      method: 'DELETE',
      url: `/api/UserBadges/${id}`,
    });
  }

  async getUserBadgeById(id: UUID): Promise<GetByIdUserBadgeResponse> {
    return this.request<GetByIdUserBadgeResponse>({
      method: 'GET',
      url: `/api/UserBadges/${id}`,
    });
  }

  // User Operation Claims API
  async getUserOperationClaimById(id: UUID): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: `/api/UserOperationClaims/${id}`,
    });
  }

  async getUserOperationClaims(params?: PaginationParams): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/UserOperationClaims',
      params,
    });
  }

  async createUserOperationClaim(data: CreateUserOperationClaimCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/UserOperationClaims',
      data,
    });
  }

  async updateUserOperationClaim(data: UpdateUserOperationClaimCommand): Promise<any> {
    return this.request<any>({
      method: 'PUT',
      url: '/api/UserOperationClaims',
      data,
    });
  }

  async deleteUserOperationClaim(data: DeleteUserOperationClaimCommand): Promise<any> {
    return this.request<any>({
      method: 'DELETE',
      url: '/api/UserOperationClaims',
      data,
    });
  }

  // User Preferences API
  async createUserPreference(data: CreateUserPreferenceCommand): Promise<CreatedUserPreferenceResponse> {
    return this.request<CreatedUserPreferenceResponse>({
      method: 'POST',
      url: '/api/UserPreferences',
      data,
    });
  }

  async updateUserPreference(data: UpdateUserPreferenceCommand): Promise<UpdatedUserPreferenceResponse> {
    return this.request<UpdatedUserPreferenceResponse>({
      method: 'PUT',
      url: '/api/UserPreferences',
      data,
    });
  }

  async getUserPreferences(params?: PaginationParams): Promise<GetListUserPreferenceListItemDtoGetListResponse> {
    return this.request<GetListUserPreferenceListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/UserPreferences',
      params,
    });
  }

  async deleteUserPreference(id: UUID): Promise<DeletedUserPreferenceResponse> {
    return this.request<DeletedUserPreferenceResponse>({
      method: 'DELETE',
      url: `/api/UserPreferences/${id}`,
    });
  }

  async getUserPreferenceById(id: UUID): Promise<GetByIdUserPreferenceResponse> {
    return this.request<GetByIdUserPreferenceResponse>({
      method: 'GET',
      url: `/api/UserPreferences/${id}`,
    });
  }

  // Users API
  async getUserById(id: UUID): Promise<GetByIdUserResponse> {
    return this.request<GetByIdUserResponse>({
      method: 'GET',
      url: `/api/Users/${id}`,
    });
  }

  async getUserFromAuth(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/api/Users/GetFromAuth',
    });
  }

  async getUsers(params?: PaginationParams): Promise<GetListUserListItemDtoGetListResponse> {
    return this.request<GetListUserListItemDtoGetListResponse>({
      method: 'GET',
      url: '/api/Users',
      params,
    });
  }

  async createUser(data: CreateUserCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/Users',
      data,
    });
  }

  async updateUser(data: UpdateUserCommand): Promise<any> {
    return this.request<any>({
      method: 'PUT',
      url: '/api/Users',
      data,
    });
  }

  async deleteUser(data: DeleteUserCommand): Promise<any> {
    return this.request<any>({
      method: 'DELETE',
      url: '/api/Users',
      data,
    });
  }

  async updateUserFromAuth(data: UpdateUserFromAuthCommand): Promise<any> {
    return this.request<any>({
      method: 'PUT',
      url: '/api/Users/FromAuth',
      data,
    });
  }

  async getUserFollowers(userId: UUID): Promise<GetUserFollowersResponse> {
    return this.request<GetUserFollowersResponse>({
      method: 'GET',
      url: `/api/Users/${userId}/followers`,
    });
  }

  async getUserFollowing(userId: UUID): Promise<GetUserFollowingResponse> {
    return this.request<GetUserFollowingResponse>({
      method: 'GET',
      url: `/api/Users/${userId}/following`,
    });
  }

  // Validation Codes API
  async createValidationCode(data: CreateValidationCodeCommand): Promise<any> {
    return this.request<any>({
      method: 'POST',
      url: '/api/ValidationCodes',
      data,
    });
  }
}

// Create and export a default instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };
export type { ApiClientConfig };
