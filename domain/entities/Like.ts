export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdDate: Date;
}
