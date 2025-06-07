export interface MoodCompatibility {
  userId1: string;
  userId2: string;
  /**
   * A value between 0.0 and 1.0 representing the compatibility score.
   */
  compatibilityScore: number;
  /**
   * A list of common emotions between the two users.
   */
  commonEmotions: string[];
  /**
   * The date when this compatibility score was calculated.
   */
  calculatedAt: Date;
}

export interface EmotionComparison {
  emotionType: number;
  emotionName: string;
  userScore: number;
  targetUserScore: number;
  difference: number;
  compatibilityPercentage: number;
  compatibilityLevel: string;
}

export interface MoodUser {
  userId: string;
  firstName: string;
  lastName: string;
  dominantEmotion: string;
  emotionScores: {
    emotionType: number;
    score: number;
  }[];
}

export interface MoodCompatibilityResult {
  success: boolean;
  moodCompatibility: number;
  compatibilityCategory: string;
  detailedAnalysis: string;
  user: MoodUser;
  targetUser: MoodUser;
  emotionComparisons: EmotionComparison[];
  message: string;
}
