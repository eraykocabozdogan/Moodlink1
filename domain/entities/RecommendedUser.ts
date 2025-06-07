export interface EmotionScore {
  emotionType: number;
  score: number;
}

export interface RecommendedUser {
  userId: string;
  firstName: string;
  lastName: string;
  moodCompatibility: number;
  compatibilityCategory: string;
  compatibilityReason: string;
  dominantEmotion: string;
  emotionScores: EmotionScore[];
  isFollowing?: boolean;
  followId?: string;
}

export interface UserMoodProfile {
  emotionType: number;
  score: number;
}

export interface MoodRecommendationResponse {
  success: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  userMoodProfile: UserMoodProfile[];
  compatibleUsers: RecommendedUser[];
  message: string;
}
