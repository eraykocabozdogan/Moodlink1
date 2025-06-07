// Example usage of the API Client
// This file demonstrates how to use the API client in your application

import apiClient, { ApiClient } from './apiClient';
import type {
  CreateActivityCommand,
  CreatePostCommand,
  UserForLoginDto,
  EnhancedUserForRegisterDto,
  CreateFollowCommand,
  CreateLikeCommand,
  CreateCommentCommand,
  PaginationParams,
} from './types/api';

// Example 1: Authentication
export async function loginExample() {
  try {
    const loginData: UserForLoginDto = {
      email: 'user@example.com',
      password: 'password123'
    };

    const response = await apiClient.login(loginData);
    
    // Set the auth token for subsequent requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }
    
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function registerExample() {
  try {
    const registerData: EnhancedUserForRegisterDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      userName: 'johndoe',
      birthDate: '1990-01-01T00:00:00Z',
      phoneNumber: '+1234567890'
    };

    const response = await apiClient.register(registerData);
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Example 2: Activities
export async function createActivityExample() {
  try {
    const activityData: CreateActivityCommand = {
      name: 'Morning Yoga Session',
      description: 'A relaxing yoga session to start the day',
      eventTime: '2024-01-15T08:00:00Z',
      location: 'Central Park, New York',
      createdByUserId: 'user-uuid-here',
      category: 'Wellness',
      targetMoodDescription: 'Peaceful and energized'
    };

    const response = await apiClient.createActivity(activityData);
    console.log('Activity created:', response);
    return response;
  } catch (error) {
    console.error('Failed to create activity:', error);
    throw error;
  }
}

export async function getActivitiesExample() {
  try {
    const params: PaginationParams = {
      PageIndex: 0,
      PageSize: 10
    };

    const response = await apiClient.getActivities(params);
    console.log('Activities fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    throw error;
  }
}

// Example 3: Posts
export async function createPostExample() {
  try {
    const postData: CreatePostCommand = {
      userId: 'user-uuid-here',
      contentText: 'Just had an amazing yoga session! Feeling great 🧘‍♀️',
      location: 'Central Park, New York',
      tags: ['yoga', 'wellness', 'morning']
    };

    const response = await apiClient.createPost(postData);
    console.log('Post created:', response);
    return response;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
}

export async function getFeedPostsExample() {
  try {
    const params: PaginationParams = {
      PageIndex: 0,
      PageSize: 20
    };

    const response = await apiClient.getFeedPosts(params);
    console.log('Feed posts fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch feed posts:', error);
    throw error;
  }
}

// Example 4: Social Features
export async function followUserExample(followedUserId: string) {
  try {
    const followData: CreateFollowCommand = {
      followerId: 'current-user-uuid',
      followedId: followedUserId
    };

    const response = await apiClient.createFollow(followData);
    console.log('User followed:', response);
    return response;
  } catch (error) {
    console.error('Failed to follow user:', error);
    throw error;
  }
}

export async function likePostExample(postId: string) {
  try {
    const likeData: CreateLikeCommand = {
      userId: 'current-user-uuid',
      postId: postId
    };

    const response = await apiClient.createLike(likeData);
    console.log('Post liked:', response);
    return response;
  } catch (error) {
    console.error('Failed to like post:', error);
    throw error;
  }
}

export async function commentOnPostExample(postId: string, content: string) {
  try {
    const commentData: CreateCommentCommand = {
      postId: postId,
      userId: 'current-user-uuid',
      content: content
    };

    const response = await apiClient.createComment(commentData);
    console.log('Comment created:', response);
    return response;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw error;
  }
}

// Example 5: User Profile
export async function getUserProfileExample(userId: string) {
  try {
    const response = await apiClient.getUserById(userId);
    console.log('User profile fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}

export async function getCurrentUserExample() {
  try {
    const response = await apiClient.getUserFromAuth();
    console.log('Current user fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
}

// Example 6: Search
export async function searchExample(query: string) {
  try {
    const params: PaginationParams = {
      PageIndex: 0,
      PageSize: 10
    };

    const response = await apiClient.searchUsersAndPosts(query, params);
    console.log('Search results:', response);
    return response;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Example 7: AI Features
export async function testAIExample(text: string) {
  try {
    const response = await apiClient.testChatGPT(text);
    console.log('AI analysis result:', response);
    return response;
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw error;
  }
}

export async function checkUserMoodExample(userId: string) {
  try {
    const response = await apiClient.checkUserMood(userId);
    console.log('User mood analysis:', response);
    return response;
  } catch (error) {
    console.error('Failed to check user mood:', error);
    throw error;
  }
}

// Example 8: Custom API Client Configuration
export function createCustomApiClientExample() {
  const customApiClient = new ApiClient({
    baseURL: 'https://custom-api.moodlink.com',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'custom-value'
    }
  });

  // Set auth token
  customApiClient.setAuthToken('your-jwt-token-here');

  return customApiClient;
}

// Example 9: Error Handling
export async function errorHandlingExample() {
  try {
    // This will likely fail without proper authentication
    const response = await apiClient.getUserFromAuth();
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('User is not authenticated, redirecting to login...');
      // Handle authentication error
    } else if (error.response?.status === 403) {
      console.log('User does not have permission for this action');
      // Handle authorization error
    } else if (error.response?.status >= 500) {
      console.log('Server error occurred, please try again later');
      // Handle server error
    } else {
      console.log('An unexpected error occurred:', error.message);
      // Handle other errors
    }
    throw error;
  }
}

// Example 10: Batch Operations
export async function batchOperationsExample() {
  try {
    // Get user profile and their posts in parallel
    const userId = 'user-uuid-here';
    const [userProfile, userPosts, userStats] = await Promise.all([
      apiClient.getUserById(userId),
      apiClient.getUserPosts(userId, { PageIndex: 0, PageSize: 10 }),
      apiClient.getUserActivityStats(userId)
    ]);

    console.log('Batch operation results:', {
      userProfile,
      userPosts,
      userStats
    });

    return { userProfile, userPosts, userStats };
  } catch (error) {
    console.error('Batch operation failed:', error);
    throw error;
  }
}
