import { Post } from "../../entities/Post";
import { EmotionType } from "../../entities/EmotionScore";

export class MoodVisualizationUseCase {
  /**
   * Extracts and processes emotion scores from a post for visualization
   */
  getPostEmotionVisualization(post: Post): {
    dominantEmotion: string;
    emotionDistribution: {
      emotion: string;
      score: number;
      percentage: number;
    }[];
    emotionColor: string;
  } {
    if (!post.emotionScores || post.emotionScores.length === 0) {
      return {
        dominantEmotion: "Bilinmiyor",
        emotionDistribution: [],
        emotionColor: "#CCCCCC", // Nötr renk
      };
    }

    // Toplam skoru hesapla
    const totalScore = post.emotionScores.reduce(
      (sum, es) => sum + es.score,
      0
    );

    // En baskın duyguyu bul
    const dominantEmotionScore = post.emotionScores.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    // Duygu dağılımını hesapla
    const distribution = post.emotionScores.map((es) => {
      const percentage = totalScore > 0 ? (es.score / totalScore) * 100 : 0;
      return {
        emotion: this.getEmotionName(es.emotionType),
        score: es.score,
        percentage,
      };
    });

    // Baskın duyguya göre bir renk belirle
    const emotionColor = this.getEmotionColor(dominantEmotionScore.emotionType);

    return {
      dominantEmotion: this.getEmotionName(dominantEmotionScore.emotionType),
      emotionDistribution: distribution,
      emotionColor,
    };
  }

  /**
   * Processes mood compatibility value for visualization
   */
  getMoodCompatibilityVisualization(post: Post): {
    compatibilityPercentage: number;
    compatibilityLevel: string;
    compatibilityColor: string;
  } {
    if (!post.moodCompatibility) {
      return {
        compatibilityPercentage: 0,
        compatibilityLevel: "Bilinmiyor",
        compatibilityColor: "#CCCCCC",
      };
    }

    // Uyumluluk yüzdesini hesapla (0-100 arası)
    const compatibilityValue = parseFloat(post.moodCompatibility);
    const compatibilityPercentage = Math.min(
      Math.max(compatibilityValue * 100, 0),
      100
    );

    // Uyumluluk seviyesini belirle
    let compatibilityLevel: string;
    let compatibilityColor: string;

    if (compatibilityPercentage >= 80) {
      compatibilityLevel = "Çok Yüksek";
      compatibilityColor = "#00CC00"; // Yeşil
    } else if (compatibilityPercentage >= 60) {
      compatibilityLevel = "Yüksek";
      compatibilityColor = "#88CC00"; // Açık Yeşil
    } else if (compatibilityPercentage >= 40) {
      compatibilityLevel = "Orta";
      compatibilityColor = "#CCCC00"; // Sarı
    } else if (compatibilityPercentage >= 20) {
      compatibilityLevel = "Düşük";
      compatibilityColor = "#CC8800"; // Turuncu
    } else {
      compatibilityLevel = "Çok Düşük";
      compatibilityColor = "#CC0000"; // Kırmızı
    }

    return {
      compatibilityPercentage,
      compatibilityLevel,
      compatibilityColor,
    };
  }

  /**
   * Maps emotion type enum to human-readable name
   */
  private getEmotionName(emotionType: number): string {
    const emotions: Record<number, string> = {
      [EmotionType.Mutluluk]: "Mutluluk",
      [EmotionType.Uzuntu]: "Üzüntü",
      [EmotionType.Ofke]: "Öfke",
      [EmotionType.Endise]: "Endişe",
      [EmotionType.Stres]: "Stres",
      [EmotionType.Huzur]: "Huzur",
      [EmotionType.Enerji]: "Enerji",
      [EmotionType.Heyecan]: "Heyecan",
      [EmotionType.Yalnizlik]: "Yalnızlık",
      [EmotionType.Mizah]: "Mizah",
    };
    return emotions[emotionType] || "Bilinmiyor";
  }

  /**
   * Maps emotion type enum to color code
   */
  private getEmotionColor(emotionType: number): string {
    const colors: Record<number, string> = {
      [EmotionType.Mutluluk]: "#FFD700", // Mutluluk - Altın
      [EmotionType.Uzuntu]: "#4682B4", // Üzüntü - Çelik Mavisi
      [EmotionType.Ofke]: "#FF4500", // Öfke - Kırmızımsı Turuncu
      [EmotionType.Endise]: "#9370DB", // Endişe - Orta Mor
      [EmotionType.Stres]: "#B22222", // Stres - Ateş Tuğlası
      [EmotionType.Huzur]: "#20B2AA", // Huzur - Açık Deniz Yeşili
      [EmotionType.Enerji]: "#FF8C00", // Enerji - Koyu Turuncu
      [EmotionType.Heyecan]: "#FF1493", // Heyecan - Derin Pembe
      [EmotionType.Yalnizlik]: "#708090", // Yalnızlık - Arduvaz Grisi
      [EmotionType.Mizah]: "#00BFFF", // Mizah - Derin Gök Mavisi
    };
    return colors[emotionType] || "#CCCCCC";
  }
}
