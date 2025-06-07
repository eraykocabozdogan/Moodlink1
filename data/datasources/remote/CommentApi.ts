import ApiService from "./ApiService";
import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import {
  CreateCommentCommand,
  CreatedCommentResponse,
  UpdateCommentCommand,
  UpdatedCommentResponse,
  DeletedCommentResponse,
  GetByIdCommentResponse,
  GetListCommentResponse,
} from "../../dtos/CommentDto";

const CommentApi = {
  create: async (
    command: CreateCommentCommand
  ): Promise<CreatedCommentResponse> => {
    const { data } = await ApiService.post<CreatedCommentResponse>(
      API_ENDPOINTS.COMMENTS,
      command
    );
    return data;
  },

  update: async (
    command: UpdateCommentCommand
  ): Promise<UpdatedCommentResponse> => {
    const { data } = await ApiService.put<UpdatedCommentResponse>(
      API_ENDPOINTS.COMMENTS,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedCommentResponse> => {
    const { data } = await ApiService.delete<DeletedCommentResponse>(
      API_ENDPOINTS.GET_COMMENT_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdCommentResponse> => {
    const { data } = await ApiService.get<GetByIdCommentResponse>(
      API_ENDPOINTS.GET_COMMENT_BY_ID(id)
    );
    return data;
  },

  getCommentsByPostId: async (
    postId: string
  ): Promise<{ postId: string; comments: GetByIdCommentResponse[] }> => {
    const { data } = await ApiService.get<{
      postId: string;
      comments: GetByIdCommentResponse[];
    }>(`/api/Posts/${postId}/comments`);
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListCommentResponse> => {
    const { data } = await ApiService.get<GetListCommentResponse>(
      API_ENDPOINTS.COMMENTS,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },

  getPostComments: async (
    postId: string,
    params: PageRequest
  ): Promise<GetListCommentResponse> => {
    const { data } = await ApiService.get<GetListCommentResponse>(
      API_ENDPOINTS.GET_POST_COMMENTS(postId),
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

export default CommentApi;
