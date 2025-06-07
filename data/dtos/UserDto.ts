import { GetListResponse } from "./GetListResponse";

// Base User DTO from GetByIdUserResponse schema
export interface UserDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
  createdDate: string;
  // roles are not in GetById response, so might be separate
}

// Get User List
export interface GetListUserListItemDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
}
export type GetListUserResponse = GetListResponse<GetListUserListItemDto>;

// Get User by ID
export type GetByIdUserResponse = UserDto;

// Get User From Auth
export interface GetUserFromAuthResponse {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
}

// Create User
export interface CreateUserCommand {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
}
// Response for CreateUser is not defined in spec, assuming it returns a user object
export interface CreatedUserResponse extends UserDto {}

// Update User
export interface UpdateUserCommand {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}
// Response for UpdateUser is not defined in spec, assuming it returns a user object
export interface UpdatedUserResponse extends UserDto {}

// Update User From Auth
export interface UpdateUserFromAuthCommand {
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
}
// Response for UpdateUserFromAuth is not defined in spec, assuming it returns a user object
export interface UpdatedUserFromAuthResponse extends UserDto {}

// Delete User
export interface DeleteUserCommand {
  id: string;
}
// Response for DeleteUser is not defined in spec, assuming it returns the id
export interface DeletedUserResponse {
  id: string;
}
