import ApiService from "./ApiService";
import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import {
  CreateFollowCommand,
  CreatedFollowResponse,
  UpdateFollowCommand,
  UpdatedFollowResponse,
  DeletedFollowResponse,
  GetByIdFollowResponse,
  GetListFollowResponse,
} from "../../dtos/FollowDto";

const FollowApi = {
  create: async (
    command: CreateFollowCommand
  ): Promise<CreatedFollowResponse> => {
    const { data } = await ApiService.post<CreatedFollowResponse>(
      "/api/Follows",
      command
    );
    return data;
  },

  followUser: async (followerId: string, followedId: string): Promise<any> => {
    const followData = {
      followerId,
      followedId,
      followDate: new Date().toISOString(),
    };

    const { data } = await ApiService.post<any>("/api/Follows", followData);
    return data;
  },

  unfollowUser: async (
    followerId: string,
    followedId: string
  ): Promise<any> => {
    // Implementation may vary based on your backend
    // This might need to be a DELETE with query params or finding the follow ID first
    const { data } = await ApiService.delete<any>(
      `/api/Follows?followerId=${followerId}&followedId=${followedId}`
    );
    return data;
  },

  update: async (
    command: UpdateFollowCommand
  ): Promise<UpdatedFollowResponse> => {
    const { data } = await ApiService.put<UpdatedFollowResponse>(
      API_ENDPOINTS.FOLLOWS,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedFollowResponse> => {
    const { data } = await ApiService.delete<DeletedFollowResponse>(
      API_ENDPOINTS.FOLLOW_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdFollowResponse> => {
    const { data } = await ApiService.get<GetByIdFollowResponse>(
      API_ENDPOINTS.FOLLOW_BY_ID(id)
    );
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListFollowResponse> => {
    const { data } = await ApiService.get<GetListFollowResponse>(
      API_ENDPOINTS.FOLLOWS,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },
};

export default FollowApi;
