export interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  isFollowing?: boolean; // Add following status for UI
  followId?: string; // Add follow ID for unfollow operations
  // Add other user properties as needed
}

export interface SearchResult {
  users: SearchUser[];
  totalCount: number;
  page: number;
  pageSize: number;
}
