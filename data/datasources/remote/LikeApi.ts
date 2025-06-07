import ApiService from "./ApiService";
import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import {
  CreateLikeCommand,
  CreatedLikeResponse,
  UpdateLikeCommand,
  UpdatedLikeResponse,
  DeletedLikeResponse,
  GetByIdLikeResponse,
  GetListLikeResponse,
} from "../../dtos/LikeDto";

const LikeApi = {
  create: async (command: CreateLikeCommand): Promise<CreatedLikeResponse> => {
    const { data } = await ApiService.post<CreatedLikeResponse>(
      API_ENDPOINTS.LIKES,
      command
    );
    return data;
  },

  update: async (command: UpdateLikeCommand): Promise<UpdatedLikeResponse> => {
    const { data } = await ApiService.put<UpdatedLikeResponse>(
      API_ENDPOINTS.LIKES,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedLikeResponse> => {
    const { data } = await ApiService.delete<DeletedLikeResponse>(
      API_ENDPOINTS.LIKE_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdLikeResponse> => {
    const { data } = await ApiService.get<GetByIdLikeResponse>(
      API_ENDPOINTS.LIKE_BY_ID(id)
    );
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListLikeResponse> => {
    const { data } = await ApiService.get<GetListLikeResponse>(
      API_ENDPOINTS.LIKES,
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

export default LikeApi;
