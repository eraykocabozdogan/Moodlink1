import { MoodRecommendationResponse } from "../entities/RecommendedUser";
import { SearchResult } from "../entities/SearchResult";

export interface ISearchRepository {
  getSuggestedUsers(
    pageIndex: number,
    pageSize: number
  ): Promise<MoodRecommendationResponse>;
  searchUsers(
    searchTerm: string,
    pageIndex: number,
    pageSize: number
  ): Promise<SearchResult>;
}
