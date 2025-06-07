import { API_ENDPOINTS } from "@/common/constants/api";
import {
  CreatePostCommand,
  CreatedPostResponse,
  UpdatePostCommand,
  UpdatedPostResponse,
  DeletedPostResponse,
  GetByIdPostResponse,
  GetListPostResponse,
  GetFollowedUsersPostsResponse,
} from "@/core/data/dtos/PostDto";
import { PageRequest } from "@/core/data/dtos/PageRequest";
import ApiService from "./ApiService";

const PostApi = {
  create: async (command: CreatePostCommand): Promise<CreatedPostResponse> => {
    const { data } = await ApiService.post<CreatedPostResponse>(
      API_ENDPOINTS.POSTS,
      command
    );
    return data;
  },

  update: async (command: UpdatePostCommand): Promise<UpdatedPostResponse> => {
    const { data } = await ApiService.put<UpdatedPostResponse>(
      API_ENDPOINTS.POSTS,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedPostResponse> => {
    const { data } = await ApiService.delete<DeletedPostResponse>(
      API_ENDPOINTS.GET_POST_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdPostResponse> => {
    const { data } = await ApiService.get<GetByIdPostResponse>(
      API_ENDPOINTS.GET_POST_BY_ID(id)
    );
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListPostResponse> => {
    const { data } = await ApiService.get<GetListPostResponse>(
      API_ENDPOINTS.POSTS,
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },

  getFollowedUsersPosts: async (
    userId: string,
    params: PageRequest
  ): Promise<GetFollowedUsersPostsResponse> => {
    const { data } = await ApiService.get<GetFollowedUsersPostsResponse>(
      API_ENDPOINTS.GET_FOLLOWED_USERS_POSTS(userId),
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },
};

export default PostApi;
