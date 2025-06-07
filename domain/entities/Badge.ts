export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category?: string;
  unlockCondition?: string;
  createdAt: Date;
  updatedAt?: Date;
}
