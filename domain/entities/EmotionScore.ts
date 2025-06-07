export interface EmotionScore {
  id: string;
  ownerId: string;
  ownerType: EmotionScoreOwnerType;
  emotionType: EmotionType;
  score: number;
}

export enum EmotionScoreOwnerType {
  User = 0,
  Post = 1,
  Comment = 2,
}

export enum EmotionType {
  Mutluluk = 1,
  Uzuntu = 2,
  Ofke = 3,
  Endise = 4,
  Stres = 5,
  Huzur = 6,
  Enerji = 7,
  Heyecan = 8,
  Yalnizlik = 9,
  Mizah = 10,
}
