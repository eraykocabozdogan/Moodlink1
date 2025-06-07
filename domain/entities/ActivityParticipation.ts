import { Activity } from "./Activity";

export interface ActivityParticipation {
  id: string;
  activityId: string;
  userId: string;
  joinedAt: Date;

  user?: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };

  activity?: Activity;
}
