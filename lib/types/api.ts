// API Types generated from swagger.json
// This file contains TypeScript interfaces for all API schemas

// Base Types
export type UUID = string;
export type DateTime = string;

// Enums
export enum AnalysisStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Failed = 4
}

export enum ChatType {
  Private = 1,
  Group = 2
}

export enum EmotionScoreOwnerType {
  User = 1,
  Post = 2,
  Activity = 3
}

export enum EmotionType {
  Joy = 1,
  Sadness = 2,
  Anger = 3,
  Fear = 4,
  Surprise = 5,
  Disgust = 6,
  Trust = 7,
  Anticipation = 8
}

export enum NotificationType {
  Like = 1,
  Comment = 2,
  Follow = 3,
  ActivityInvite = 4,
  Message = 5,
  Badge = 6
}

// Core Interfaces
export interface AiTestResponse {
  success: boolean;
  text?: string;
  emotionScores?: EmotionScoreResult[];
  message?: string;
}

export interface EmotionScoreResult {
  emotionType: EmotionType;
  score: number;
  description?: string;
}

export interface CategoryStatsDto {
  categoryName?: string;
  activityCount: number;
}

export interface ChatMessageDto {
  id: UUID;
  chatId: UUID;
  senderUserId: UUID;
  senderUserName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  content?: string;
  sentDate: DateTime;
  attachmentFileUrl?: string;
  attachmentFileName?: string;
}

export interface CommentDto {
  id: UUID;
  postId: UUID;
  userId: UUID;
  content?: string;
  parentCommentId?: UUID;
  createdDate: DateTime;
  userName?: string;
  replies?: CommentDto[];
  likesCount: number;
}

// Activity Related Interfaces
export interface CreateActivityCommand {
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  createdByUserId: UUID;
  category?: string;
  targetMoodDescription?: string;
  activityImageFileId?: UUID;
}

export interface CreatedActivityResponse {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  createdByUserId: UUID;
  category?: string;
  targetMoodDescription?: string;
  createdDate: DateTime;
}

export interface UpdateActivityCommand {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  category?: string;
  targetMoodDescription?: string;
  activityImageFileId?: UUID;
}

export interface UpdatedActivityResponse {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  category?: string;
  targetMoodDescription?: string;
  updatedDate: DateTime;
}

export interface DeletedActivityResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdActivityResponse {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  createdByUserId: UUID;
  category?: string;
  targetMoodDescription?: string;
  createdDate: DateTime;
  participantCount: number;
  activityImageUrl?: string;
}

export interface ActivityListItemDto {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  createdByUserId: UUID;
  createdByUserName?: string;
  category?: string;
  targetMoodDescription?: string;
  createdDate: DateTime;
  participantCount: number;
  activityImageUrl?: string;
}

export interface GetListActivityListItemDtoGetListResponse {
  items: ActivityListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface UserActivityListItemDto {
  id: UUID;
  name?: string;
  description?: string;
  eventTime: DateTime;
  location?: string;
  category?: string;
  targetMoodDescription?: string;
  createdDate: DateTime;
  participantCount: number;
  activityImageUrl?: string;
}

export interface UserActivityListItemDtoGetListResponse {
  items: UserActivityListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface UserActivityStatsResponse {
  totalActivitiesCreated: number;
  totalActivitiesParticipated: number;
  categoryStats: CategoryStatsDto[];
  mostActiveCategory?: string;
}

// Activity Participation Interfaces
export interface CreateActivityParticipationCommand {
  activityId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface CreatedActivityParticipationResponse {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface UpdateActivityParticipationCommand {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface UpdatedActivityParticipationResponse {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  joinedDate: DateTime;
  updatedDate: DateTime;
}

export interface DeletedActivityParticipationResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdActivityParticipationResponse {
  id: UUID;
  activityId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface ActivityParticipationListItemDto {
  id: UUID;
  activityId: UUID;
  activityName?: string;
  userId: UUID;
  userName?: string;
  joinedDate: DateTime;
}

export interface GetListActivityParticipationListItemDtoGetListResponse {
  items: ActivityParticipationListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// AI Test Interfaces
export interface CreateTestPostResponse {
  success: boolean;
  postId?: UUID;
  message?: string;
}

export interface PostAnalysisCheckResponse {
  postId: UUID;
  status: AnalysisStatus;
  emotionScores?: EmotionScoreResult[];
  analysisDate?: DateTime;
  message?: string;
}

export interface UserMoodCheckResponse {
  userId: UUID;
  currentMood?: string;
  moodScore: number;
  lastAnalysisDate?: DateTime;
  emotionBreakdown?: EmotionScoreResult[];
  message?: string;
}

export interface UpdateUserMoodResponse {
  success: boolean;
  userId?: UUID;
  newMoodScore: number;
  message?: string;
}

export interface EmotionTypesResponse {
  emotionTypes: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

export interface TestExamplesResponse {
  examples: Array<{
    id: number;
    text: string;
    expectedEmotions: EmotionScoreResult[];
  }>;
}

// Auth Interfaces
export interface UserForLoginDto {
  email?: string;
  password?: string;
}

export interface EnhancedUserForRegisterDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userName?: string;
  birthDate?: DateTime;
  phoneNumber?: string;
}

export interface SendEmailValidationCommand {
  email?: string;
}

export interface SendPasswordResetCodeCommand {
  email?: string;
}

export interface VerifyCodeCommand {
  email?: string;
  code?: string;
}

export interface ResetPasswordCommand {
  email?: string;
  code?: string;
  newPassword?: string;
}

// Badge Interfaces
export interface CreateBadgeCommand {
  name?: string;
  description?: string;
  iconFileId?: UUID;
}

export interface CreatedBadgeResponse {
  id: UUID;
  name?: string;
  description?: string;
  iconFileId?: UUID;
  createdDate: DateTime;
}

export interface UpdateBadgeCommand {
  id: UUID;
  name?: string;
  description?: string;
  iconFileId?: UUID;
}

export interface UpdatedBadgeResponse {
  id: UUID;
  name?: string;
  description?: string;
  iconFileId?: UUID;
  updatedDate: DateTime;
}

export interface DeletedBadgeResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdBadgeResponse {
  id: UUID;
  name?: string;
  description?: string;
  iconFileUrl?: string;
  createdDate: DateTime;
}

export interface BadgeListItemDto {
  id: UUID;
  name?: string;
  description?: string;
  iconFileUrl?: string;
  createdDate: DateTime;
}

export interface GetListBadgeListItemDtoGetListResponse {
  items: BadgeListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Chat Interfaces
export interface CreateChatCommand {
  type: ChatType;
  name?: string;
  creatorUserId: UUID;
  participantUserIds?: UUID[];
  groupImageFileId?: UUID;
}

export interface CreateChatResponse {
  id: UUID;
  type?: string;
  name?: string;
  participantCount: number;
  createdDate: DateTime;
  isExisting: boolean;
}

export interface UpdateChatCommand {
  id: UUID;
  name?: string;
  groupImageFileId?: UUID;
}

export interface UpdatedChatResponse {
  id: UUID;
  name?: string;
  groupImageFileUrl?: string;
  updatedDate: DateTime;
}

export interface DeletedChatResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdChatResponse {
  id: UUID;
  type: ChatType;
  name?: string;
  creatorUserId: UUID;
  createdDate: DateTime;
  groupImageFileUrl?: string;
  participantCount: number;
  lastMessage?: ChatMessageDto;
}

export interface ChatListItemDto {
  id: UUID;
  type: ChatType;
  name?: string;
  creatorUserId: UUID;
  createdDate: DateTime;
  groupImageFileUrl?: string;
  participantCount: number;
  lastMessage?: ChatMessageDto;
  unreadMessageCount: number;
}

export interface GetListChatListItemDtoGetListResponse {
  items: ChatListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetUserChatsResponse {
  chats: ChatListItemDto[];
  totalCount: number;
}

// Chat Participant Interfaces
export interface CreateChatParticipantCommand {
  chatId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface CreatedChatParticipantResponse {
  id: UUID;
  chatId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface UpdateChatParticipantCommand {
  id: UUID;
  chatId: UUID;
  userId: UUID;
  joinedDate: DateTime;
}

export interface UpdatedChatParticipantResponse {
  id: UUID;
  chatId: UUID;
  userId: UUID;
  joinedDate: DateTime;
  updatedDate: DateTime;
}

export interface DeletedChatParticipantResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdChatParticipantResponse {
  id: UUID;
  chatId: UUID;
  userId: UUID;
  userName?: string;
  joinedDate: DateTime;
}

export interface ChatParticipantListItemDto {
  id: UUID;
  chatId: UUID;
  chatName?: string;
  userId: UUID;
  userName?: string;
  joinedDate: DateTime;
}

export interface GetListChatParticipantListItemDtoGetListResponse {
  items: ChatParticipantListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Comment Interfaces
export interface CreateCommentCommand {
  postId: UUID;
  userId: UUID;
  content?: string;
  parentCommentId?: UUID;
}

export interface CreatedCommentResponse {
  id: UUID;
  postId: UUID;
  userId: UUID;
  content?: string;
  parentCommentId?: UUID;
  createdDate: DateTime;
}

export interface UpdateCommentCommand {
  id: UUID;
  content?: string;
}

export interface UpdatedCommentResponse {
  id: UUID;
  content?: string;
  updatedDate: DateTime;
}

export interface DeletedCommentResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdCommentResponse {
  id: UUID;
  postId: UUID;
  userId: UUID;
  userName?: string;
  content?: string;
  parentCommentId?: UUID;
  createdDate: DateTime;
  replies?: CommentDto[];
  likesCount: number;
}

// Emotion Score Interfaces
export interface CreateEmotionScoreCommand {
  ownerId: UUID;
  ownerType: EmotionScoreOwnerType;
  emotionType: EmotionType;
  score: number;
}

export interface CreatedEmotionScoreResponse {
  id: UUID;
  ownerId: UUID;
  ownerType: EmotionScoreOwnerType;
  emotionType: EmotionType;
  score: number;
  createdDate: DateTime;
}

export interface UpdateEmotionScoreCommand {
  id: UUID;
  score: number;
}

export interface UpdatedEmotionScoreResponse {
  id: UUID;
  score: number;
  updatedDate: DateTime;
}

export interface DeletedEmotionScoreResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdEmotionScoreResponse {
  id: UUID;
  ownerId: UUID;
  ownerType: EmotionScoreOwnerType;
  emotionType: EmotionType;
  score: number;
  createdDate: DateTime;
}

// Follow Interfaces
export interface CreateFollowCommand {
  followerId: UUID;
  followedId: UUID;
}

export interface CreatedFollowResponse {
  id: UUID;
  followerId: UUID;
  followedId: UUID;
  followedDate: DateTime;
}

export interface DeletedFollowResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdFollowResponse {
  id: UUID;
  followerId: UUID;
  followerUserName?: string;
  followedId: UUID;
  followedUserName?: string;
  followedDate: DateTime;
}

export interface FollowListItemDto {
  id: UUID;
  followerId: UUID;
  followerUserName?: string;
  followedId: UUID;
  followedUserName?: string;
  followedDate: DateTime;
}

export interface GetListFollowListItemDtoGetListResponse {
  items: FollowListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetUserFollowersResponse {
  followers: Array<{
    id: UUID;
    userName?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    followedDate: DateTime;
  }>;
  totalCount: number;
}

export interface GetUserFollowingResponse {
  following: Array<{
    id: UUID;
    userName?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    followedDate: DateTime;
  }>;
  totalCount: number;
}

// Like Interfaces
export interface CreateLikeCommand {
  userId: UUID;
  postId?: UUID;
  commentId?: UUID;
}

export interface CreatedLikeResponse {
  id: UUID;
  userId: UUID;
  postId?: UUID;
  commentId?: UUID;
  likedDate: DateTime;
}

export interface DeletedLikeResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdLikeResponse {
  id: UUID;
  userId: UUID;
  userName?: string;
  postId?: UUID;
  commentId?: UUID;
  likedDate: DateTime;
}

// Message Interfaces
export interface CreateMessageCommand {
  chatId: UUID;
  senderUserId: UUID;
  content?: string;
  sentDate: DateTime;
  attachmentFileId?: UUID;
}

export interface CreatedMessageResponse {
  id: UUID;
  chatId: UUID;
  senderUserId: UUID;
  content?: string;
  sentDate: DateTime;
  attachmentFileUrl?: string;
}

export interface UpdateMessageCommand {
  id: UUID;
  content?: string;
}

export interface UpdatedMessageResponse {
  id: UUID;
  content?: string;
  updatedDate: DateTime;
}

export interface DeletedMessageResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdMessageResponse {
  id: UUID;
  chatId: UUID;
  senderUserId: UUID;
  senderUserName?: string;
  content?: string;
  sentDate: DateTime;
  attachmentFileUrl?: string;
  attachmentFileName?: string;
}

export interface GetChatMessagesResponse {
  messages: ChatMessageDto[];
  totalCount: number;
  hasMore: boolean;
}

// Notification Interfaces
export interface CreateNotificationCommand {
  userId: UUID;
  type: NotificationType;
  content?: string;
  relatedEntityId?: UUID;
  relatedEntityType?: string;
  isRead: boolean;
}

export interface CreatedNotificationResponse {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  content?: string;
  relatedEntityId?: UUID;
  relatedEntityType?: string;
  isRead: boolean;
  createdDate: DateTime;
}

export interface UpdateNotificationCommand {
  id: UUID;
  isRead: boolean;
}

export interface UpdatedNotificationResponse {
  id: UUID;
  isRead: boolean;
  updatedDate: DateTime;
}

export interface DeletedNotificationResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdNotificationResponse {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  content?: string;
  relatedEntityId?: UUID;
  relatedEntityType?: string;
  isRead: boolean;
  createdDate: DateTime;
}

export interface NotificationListItemDto {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  content?: string;
  relatedEntityId?: UUID;
  relatedEntityType?: string;
  isRead: boolean;
  createdDate: DateTime;
}

export interface GetListNotificationListItemDtoGetListResponse {
  items: NotificationListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetUserNotificationsResponse {
  notifications: NotificationListItemDto[];
  unreadCount: number;
  totalCount: number;
}

// Post Interfaces
export interface CreatePostCommand {
  userId: UUID;
  contentText?: string;
  imageFileIds?: UUID[];
  location?: string;
  tags?: string[];
}

export interface CreatedPostResponse {
  id: UUID;
  userId: UUID;
  contentText?: string;
  location?: string;
  createdDate: DateTime;
  imageUrls?: string[];
}

export interface UpdatePostCommand {
  id: UUID;
  contentText?: string;
  location?: string;
  tags?: string[];
}

export interface UpdatedPostResponse {
  id: UUID;
  contentText?: string;
  location?: string;
  updatedDate: DateTime;
}

export interface DeletedPostResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdPostResponse {
  id: UUID;
  userId: UUID;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  userProfileImageUrl?: string;
  contentText?: string;
  location?: string;
  createdDate: DateTime;
  imageUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  tags?: string[];
  comments?: CommentDto[];
}

export interface PostListItemDto {
  id: UUID;
  userId: UUID;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  userProfileImageUrl?: string;
  contentText?: string;
  location?: string;
  createdDate: DateTime;
  imageUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  tags?: string[];
}

export interface GetListPostListItemDtoGetListResponse {
  items: PostListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetUserPostsResponse {
  posts: PostListItemDto[];
  totalCount: number;
}

export interface GetFeedPostsResponse {
  posts: PostListItemDto[];
  totalCount: number;
  hasMore: boolean;
}

// Search Interfaces
export interface SearchUsersAndPostsResponse {
  users: Array<{
    id: UUID;
    userName?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    followersCount: number;
    isFollowedByCurrentUser: boolean;
  }>;
  posts: PostListItemDto[];
  totalUsersCount: number;
  totalPostsCount: number;
}

// User Interfaces
export interface CreateUserCommand {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  birthDate?: DateTime;
  phoneNumber?: string;
}

export interface UpdateUserCommand {
  id: UUID;
  firstName?: string;
  lastName?: string;
  userName?: string;
  birthDate?: DateTime;
  phoneNumber?: string;
  profileImageFileId?: UUID;
  bio?: string;
}

export interface UpdateUserFromAuthCommand {
  firstName?: string;
  lastName?: string;
  userName?: string;
  birthDate?: DateTime;
  phoneNumber?: string;
  profileImageFileId?: UUID;
  bio?: string;
}

export interface DeleteUserCommand {
  id: UUID;
}

export interface GetByIdUserResponse {
  id: UUID;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  birthDate?: DateTime;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio?: string;
  createdDate: DateTime;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByCurrentUser: boolean;
}

export interface UserListItemDto {
  id: UUID;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  profileImageUrl?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByCurrentUser: boolean;
}

export interface GetListUserListItemDtoGetListResponse {
  items: UserListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// User Badge Interfaces
export interface CreateUserBadgeCommand {
  userId: UUID;
  badgeId: UUID;
  earnedDate: DateTime;
}

export interface CreatedUserBadgeResponse {
  id: UUID;
  userId: UUID;
  badgeId: UUID;
  earnedDate: DateTime;
}

export interface UpdateUserBadgeCommand {
  id: UUID;
  earnedDate: DateTime;
}

export interface UpdatedUserBadgeResponse {
  id: UUID;
  earnedDate: DateTime;
  updatedDate: DateTime;
}

export interface DeletedUserBadgeResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdUserBadgeResponse {
  id: UUID;
  userId: UUID;
  userName?: string;
  badgeId: UUID;
  badgeName?: string;
  badgeDescription?: string;
  badgeIconUrl?: string;
  earnedDate: DateTime;
}

export interface UserBadgeListItemDto {
  id: UUID;
  userId: UUID;
  userName?: string;
  badgeId: UUID;
  badgeName?: string;
  badgeDescription?: string;
  badgeIconUrl?: string;
  earnedDate: DateTime;
}

export interface GetListUserBadgeListItemDtoGetListResponse {
  items: UserBadgeListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// User Preference Interfaces
export interface CreateUserPreferenceCommand {
  userId: UUID;
  preferenceKey?: string;
  preferenceValue?: string;
}

export interface CreatedUserPreferenceResponse {
  id: UUID;
  userId: UUID;
  preferenceKey?: string;
  preferenceValue?: string;
  createdDate: DateTime;
}

export interface UpdateUserPreferenceCommand {
  id: UUID;
  preferenceValue?: string;
}

export interface UpdatedUserPreferenceResponse {
  id: UUID;
  preferenceValue?: string;
  updatedDate: DateTime;
}

export interface DeletedUserPreferenceResponse {
  id: UUID;
  deletedDate: DateTime;
}

export interface GetByIdUserPreferenceResponse {
  id: UUID;
  userId: UUID;
  preferenceKey?: string;
  preferenceValue?: string;
  createdDate: DateTime;
}

export interface UserPreferenceListItemDto {
  id: UUID;
  userId: UUID;
  userName?: string;
  preferenceKey?: string;
  preferenceValue?: string;
  createdDate: DateTime;
}

export interface GetListUserPreferenceListItemDtoGetListResponse {
  items: UserPreferenceListItemDto[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Operation Claim Interfaces
export interface CreateOperationClaimCommand {
  name?: string;
  roles?: string[];
}

export interface CreateUserOperationClaimCommand {
  userId: UUID;
  operationClaimId: UUID;
}

export interface UpdateUserOperationClaimCommand {
  id: UUID;
  userId: UUID;
  operationClaimId: UUID;
}

export interface DeleteUserOperationClaimCommand {
  id: UUID;
}

// Validation Code Interfaces
export interface CreateValidationCodeCommand {
  email?: string;
  code?: string;
  expirationDate: DateTime;
}

// Mail Log Interfaces
export interface CreateMailLogCommand {
  sentDate: DateTime;
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  isBodyHtml: boolean;
  isSentSuccessfully: boolean;
  errorMessage?: string;
}

// Common Pagination Interface
export interface PaginationParams {
  PageIndex?: number;
  PageSize?: number;
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  errors?: string[];
}
