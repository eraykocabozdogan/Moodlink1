import { Badge } from "./Badge";
import { User } from "./User";

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;

  user?: User;
  badge?: Badge;
}
