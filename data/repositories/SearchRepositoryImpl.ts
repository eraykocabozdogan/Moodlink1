import { ISearchRepository } from "../../domain/repositories/ISearchRepository";
import { MoodRecommendationResponse } from "../../domain/entities/RecommendedUser";
import { SearchResult } from "../../domain/entities/SearchResult";
import SearchApi from "../datasources/remote/SearchApi";

export class SearchRepositoryImpl implements ISearchRepository {
  constructor(private searchApi: typeof SearchApi) {}

  async getSuggestedUsers(
    pageIndex: number,
    pageSize: number
  ): Promise<MoodRecommendationResponse> {
    return this.searchApi.getSuggestedUsers(pageIndex, pageSize);
  }

  async searchUsers(
    searchTerm: string,
    pageIndex: number,
    pageSize: number
  ): Promise<SearchResult> {
    return this.searchApi.searchUsers(searchTerm, pageIndex, pageSize);
  }
}
