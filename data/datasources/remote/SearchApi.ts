import ApiService from "./ApiService";
import { MoodRecommendationResponse } from "../../../domain/entities/RecommendedUser";
import { SearchResult } from "../../../domain/entities/SearchResult";

const SearchApi = {
  getSuggestedUsers: async (
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<MoodRecommendationResponse> => {
    const { data } = await ApiService.get<MoodRecommendationResponse>(
      "/api/MoodBasedRecommendation/users",
      {
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      }
    );
    return data;
  },

  searchUsers: async (
    searchTerm: string,
    pageIndex: number = 0,
    pageSize: number = 20
  ): Promise<SearchResult> => {
    const { data } = await ApiService.get<SearchResult>("/api/Search", {
      params: {
        searchTerm,
        PageIndex: pageIndex,
        PageSize: pageSize,
      },
    });
    return data;
  },
};

export default SearchApi;
