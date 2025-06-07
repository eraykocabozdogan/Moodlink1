export interface User {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  bio?: string;
  profileImageUrl?: string;
  createdDate: Date;
  followers: number;
  following: number;
  isFollowing?: boolean;
  moodCompatibility?: string;
  authenticatorType?: string;
}
