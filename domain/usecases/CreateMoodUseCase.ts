import { Mood } from "../entities/Mood";
import { IMoodRepository } from "../repositories/IMoodRepository";

export class CreateMoodUseCase {
  constructor(private moodRepository: IMoodRepository) {}

  async execute(moodData: {
    userId: string;
    moodLevel: number;
    description?: string;
    emotions: string[];
    activities: string[];
    location?: string;
    weather?: string;
  }): Promise<Mood> {
    // Validasyon
    if (moodData.moodLevel < 1 || moodData.moodLevel > 10) {
      throw new Error("Mood level must be between 1 and 10");
    }

    if (!moodData.userId) {
      throw new Error("User ID is required");
    }

    if (!moodData.emotions || moodData.emotions.length === 0) {
      throw new Error("At least one emotion is required");
    }

    // Repository'den mood oluştur
    return await this.moodRepository.createMood(moodData);
  }
}
