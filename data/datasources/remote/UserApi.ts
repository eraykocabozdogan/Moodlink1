import { API_ENDPOINTS } from "../../../../common/constants/api";
import {
  GetListUserResponse,
  GetByIdUserResponse,
  GetUserFromAuthResponse,
  CreateUserCommand,
  CreatedUserResponse,
  UpdateUserCommand,
  UpdatedUserResponse,
  UpdateUserFromAuthCommand,
  UpdatedUserFromAuthResponse,
  DeleteUserCommand,
  DeletedUserResponse,
} from "../../dtos/UserDto";
import { PageRequest } from "../../dtos/PageRequest";
import ApiService from "./ApiService";
import { PageResponseDto } from "../../dtos/CommonDto";
import { GetListUserListItemDto } from "../../dtos/UserDto";

const UserApi = {
  getList: async (params: PageRequest): Promise<GetListUserResponse> => {
    const { data } = await ApiService.get<GetListUserResponse>(
      API_ENDPOINTS.USERS,
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },

  create: async (command: CreateUserCommand): Promise<CreatedUserResponse> => {
    const { data } = await ApiService.post<CreatedUserResponse>(
      API_ENDPOINTS.USERS,
      command
    );
    return data;
  },

  update: async (command: UpdateUserCommand): Promise<UpdatedUserResponse> => {
    const { data } = await ApiService.put<UpdatedUserResponse>(
      API_ENDPOINTS.USERS,
      command
    );
    return data;
  },

  delete: async (command: DeleteUserCommand): Promise<DeletedUserResponse> => {
    const { data } = await ApiService.delete<DeletedUserResponse>(
      API_ENDPOINTS.USERS,
      { data: command }
    );
    return data;
  },

  getFromAuth: async (): Promise<GetUserFromAuthResponse> => {
    const { data } = await ApiService.get<GetUserFromAuthResponse>(
      API_ENDPOINTS.GET_USER_FROM_AUTH
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdUserResponse> => {
    const { data } = await ApiService.get<GetByIdUserResponse>(
      API_ENDPOINTS.GET_USER_BY_ID(id)
    );
    return data;
  },

  updateFromAuth: async (
    command: UpdateUserFromAuthCommand
  ): Promise<UpdatedUserFromAuthResponse> => {
    const { data } = await ApiService.put<UpdatedUserFromAuthResponse>(
      API_ENDPOINTS.UPDATE_USER_FROM_AUTH,
      command
    );
    return data;
  },

  getFollowers: async (
    userId: string,
    pageRequest: PageRequest
  ): Promise<PageResponseDto<GetListUserListItemDto>> => {
    const { data } = await ApiService.get<
      PageResponseDto<GetListUserListItemDto>
    >(API_ENDPOINTS.GET_FOLLOWERS(userId), {
      params: {
        PageIndex: pageRequest.pageIndex,
        PageSize: pageRequest.pageSize,
      },
    });
    return data;
  },

  getFollowing: async (
    userId: string,
    pageRequest: PageRequest
  ): Promise<PageResponseDto<GetListUserListItemDto>> => {
    const { data } = await ApiService.get<
      PageResponseDto<GetListUserListItemDto>
    >(API_ENDPOINTS.GET_FOLLOWING(userId), {
      params: {
        PageIndex: pageRequest.pageIndex,
        PageSize: pageRequest.pageSize,
      },
    });
    return data;
  },

  getUserProfile: async (userId?: string): Promise<any> => {
    // Mock data for now since API endpoint might not exist yet
    return {
      id: userId || "current-user-id",
      firstName: "Google",
      lastName: "User",
      userName: "user_name",
      email: "user@example.com",
      bio: "Hello! I'm using MoodLink.",
      followers: 13000,
      following: 32,
      moodValues: [
        { emotionType: 1, score: 62, emotionName: "Energetic" },
        { emotionType: 2, score: 56, emotionName: "Sad" },
      ],
      badges: [
        { id: "1", name: "🏆" },
        { id: "2", name: "🏅" },
      ],
      posts: [],
      postsCount: 0,
    };
  },

  // Check if current user is following a specific user by checking following list
  checkIfFollowing: async (
    currentUserId: string,
    targetUserId: string
  ): Promise<{ isFollowing: boolean; followId?: string }> => {
    try {
      const { data } = await ApiService.get<any>(
        API_ENDPOINTS.GET_FOLLOWING(currentUserId)
      );

      // Check if targetUserId exists in the following array
      if (data?.following && Array.isArray(data.following)) {
        const followRecord = data.following.find(
          (follow: any) => follow.followedId === targetUserId
        );
        if (followRecord) {
          return {
            isFollowing: true,
            followId: followRecord.id,
          };
        }
      }

      return { isFollowing: false };
    } catch (error) {
      console.error("Check if following error:", error);
      return { isFollowing: false };
    }
  },

  // Get mood compatibility between current user and target user
  getMoodCompatibility: async (targetUserId: string): Promise<any> => {
    try {
      const { data } = await ApiService.get<any>(
        API_ENDPOINTS.GET_USER_MOOD_COMPATIBILITY(targetUserId)
      );
      return data;
    } catch (error) {
      console.error("Get mood compatibility error:", error);
      throw error;
    }
  },

  // Get user posts with pagination
  getUserPosts: async (
    userId: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<any> => {
    try {
      const { data } = await ApiService.get<any>(
        API_ENDPOINTS.GET_USER_POSTS(userId),
        {
          params: {
            PageIndex: pageIndex,
            PageSize: pageSize,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Get user posts error:", error);
      throw error;
    }
  },
};

export default UserApi;
