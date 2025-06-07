export interface UserPreference {
  id: string;
  userId: string;
  darkMode: boolean;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  language: string;
  privacyLevel: PrivacyLevel;
}

export enum PrivacyLevel {
  Public = 0,
  FollowersOnly = 1,
  Private = 2,
}
