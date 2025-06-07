import { Post } from "../../entities/Post";
import { EmotionScore, EmotionType } from "../../entities/EmotionScore";
import { MoodCompatibility } from "../../entities/MoodCompatibility";
import { IMoodRepository } from "../../repositories/IMoodRepository";

export class MoodAnalysisUseCase {
  constructor(private moodRepository: IMoodRepository) {}

  /**
   * Fetches mood compatibility between two users.
   */
  async getMoodCompatibility(
    userId1: string,
    userId2: string
  ): Promise<MoodCompatibility> {
    if (!userId1 || !userId2) {
      throw new Error("İki kullanıcı ID'si de gereklidir");
    }

    if (userId1 === userId2) {
      throw new Error("Aynı kullanıcı ID'si için hesaplama yapılamaz");
    }

    return this.moodRepository.getMoodCompatibility(userId1, userId2);
  }

  /**
   * Analyzes emotions in a post, sending it to the mood analysis API
   */
  async analyzePostEmotions(post: Post): Promise<EmotionScore[]> {
    if (!post || !post.id) {
      throw new Error("Geçerli bir post gereklidir");
    }

    if (!post.contentText || post.contentText.trim().length === 0) {
      return []; // Analiz yapılacak içerik yok
    }

    return this.moodRepository.analyzePostContent(post);
  }

  /**
   * Checks if a mood compatibility value is considered compatible
   */
  isCompatible(compatibilityValue: number): boolean {
    return compatibilityValue >= 0.6; // %60 ve üzeri uyumlu kabul edilir
  }

  /**
   * Returns a compatibility description based on compatibility value
   */
  getCompatibilityDescription(compatibilityValue: number): string {
    if (compatibilityValue >= 0.8) {
      return "Çok yüksek uyumluluk";
    } else if (compatibilityValue >= 0.6) {
      return "Yüksek uyumluluk";
    } else if (compatibilityValue >= 0.4) {
      return "Orta düzeyde uyumluluk";
    } else if (compatibilityValue >= 0.2) {
      return "Düşük uyumluluk";
    } else {
      return "Çok düşük uyumluluk";
    }
  }

  /**
   * Analyzes a user's mood from recent posts
   */
  async analyzeUserMood(
    userId: string,
    sampleSize: number = 5
  ): Promise<{
    dominantEmotion: EmotionType;
    emotionScores: Record<EmotionType, number>;
  }> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    return this.moodRepository.analyzeUserMood(userId, sampleSize);
  }
}
