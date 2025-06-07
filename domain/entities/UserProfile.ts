import { User } from "./User";
import { Post } from "./Post";
import { UserBadge } from "./UserBadge";

export interface MoodValue {
  emotionType: number;
  score: number;
  emotionName: string;
}

export interface UserProfile extends User {
  moodValues: MoodValue[];
  badges: UserBadge[];
  posts: Post[];
  postsCount: number;
}
