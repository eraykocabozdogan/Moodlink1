export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  createdAt: Date;
  updatedAt?: Date;

  user?: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };

  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}
