import { EmotionScore } from "./EmotionScore";
import { AnalysisStatus } from "@/core/data/enums";

export interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  contentText: string;
  imageUrl?: string;
  createdDate: Date;
  updatedDate?: Date;
  analysisStatus: AnalysisStatus;
  likes: number;
  comments: number;
  isLiked?: boolean;
  emotionScores?: EmotionScore[];
  moodCompatibility?: string;
}
