import { User } from "./User";

export interface Follow {
  id: string;
  followerId: string;
  followedId: string;
  followedAt: Date;

  follower?: User;
  followed?: User;
}
