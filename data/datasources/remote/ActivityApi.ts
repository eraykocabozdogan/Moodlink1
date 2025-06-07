import { API_ENDPOINTS } from "@/common/constants/api";
import {
  CreateActivityCommand,
  CreatedActivityResponse,
  UpdateActivityCommand,
  UpdatedActivityResponse,
  DeletedActivityResponse,
  GetByIdActivityResponse,
  GetListActivityResponse,
  GetUserActivitiesResponse,
  UserActivityStatsResponse,
  CreateActivityParticipationCommand,
  CreatedActivityParticipationResponse,
  UpdateActivityParticipationCommand,
  UpdatedActivityParticipationResponse,
  DeletedActivityParticipationResponse,
  GetByIdActivityParticipationResponse,
  GetListActivityParticipationResponse,
} from "@/core/data/dtos/ActivityDto";
import { PageRequest } from "@/core/data/dtos/PageRequest";
import ApiService from "./ApiService";

const ActivityApi = {
  // Activity
  getList: async (params: PageRequest): Promise<GetListActivityResponse> => {
    const { data } = await ApiService.get<GetListActivityResponse>(
      API_ENDPOINTS.ACTIVITIES,
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },
  getById: async (id: string): Promise<GetByIdActivityResponse> => {
    const { data } = await ApiService.get<GetByIdActivityResponse>(
      API_ENDPOINTS.ACTIVITY_BY_ID(id)
    );
    return data;
  },
  create: async (
    command: CreateActivityCommand
  ): Promise<CreatedActivityResponse> => {
    const { data } = await ApiService.post<CreatedActivityResponse>(
      API_ENDPOINTS.ACTIVITIES,
      command
    );
    return data;
  },
  update: async (
    command: UpdateActivityCommand
  ): Promise<UpdatedActivityResponse> => {
    const { data } = await ApiService.put<UpdatedActivityResponse>(
      API_ENDPOINTS.ACTIVITIES,
      command
    );
    return data;
  },
  delete: async (id: string): Promise<DeletedActivityResponse> => {
    const { data } = await ApiService.delete<DeletedActivityResponse>(
      API_ENDPOINTS.ACTIVITY_BY_ID(id)
    );
    return data;
  },

  // User-specific Activity endpoints
  getUserCreatedActivities: async (
    userId: string,
    params: PageRequest
  ): Promise<GetUserActivitiesResponse> => {
    const { data } = await ApiService.get<GetUserActivitiesResponse>(
      API_ENDPOINTS.GET_USER_CREATED_ACTIVITIES(userId),
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },
  getUserParticipatedActivities: async (
    userId: string,
    params: PageRequest
  ): Promise<GetUserActivitiesResponse> => {
    const { data } = await ApiService.get<GetUserActivitiesResponse>(
      API_ENDPOINTS.GET_USER_PARTICIPATED_ACTIVITIES(userId),
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },
  getUserActivityStats: async (
    userId: string
  ): Promise<UserActivityStatsResponse> => {
    const { data } = await ApiService.get<UserActivityStatsResponse>(
      API_ENDPOINTS.GET_USER_ACTIVITY_STATS(userId)
    );
    return data;
  },

  // ActivityParticipation
  getParticipationList: async (
    params: PageRequest
  ): Promise<GetListActivityParticipationResponse> => {
    const { data } = await ApiService.get<GetListActivityParticipationResponse>(
      API_ENDPOINTS.ACTIVITY_PARTICIPATIONS,
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },
  getParticipationById: async (
    id: string
  ): Promise<GetByIdActivityParticipationResponse> => {
    const { data } = await ApiService.get<GetByIdActivityParticipationResponse>(
      API_ENDPOINTS.ACTIVITY_PARTICIPATION_BY_ID(id)
    );
    return data;
  },
  createParticipation: async (
    command: CreateActivityParticipationCommand
  ): Promise<CreatedActivityParticipationResponse> => {
    const { data } =
      await ApiService.post<CreatedActivityParticipationResponse>(
        API_ENDPOINTS.ACTIVITY_PARTICIPATIONS,
        command
      );
    return data;
  },
  updateParticipation: async (
    command: UpdateActivityParticipationCommand
  ): Promise<UpdatedActivityParticipationResponse> => {
    const { data } = await ApiService.put<UpdatedActivityParticipationResponse>(
      API_ENDPOINTS.ACTIVITY_PARTICIPATIONS,
      command
    );
    return data;
  },
  deleteParticipation: async (
    id: string
  ): Promise<DeletedActivityParticipationResponse> => {
    const { data } =
      await ApiService.delete<DeletedActivityParticipationResponse>(
        API_ENDPOINTS.ACTIVITY_PARTICIPATION_BY_ID(id)
      );
    return data;
  },
};

export default ActivityApi;
