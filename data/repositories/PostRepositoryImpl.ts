import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import PostApi from "../datasources/remote/PostApi";
import { PostMapper } from "../mappers/PostMapper";

export class PostRepositoryImpl implements IPostRepository {
  constructor(private postApi: typeof PostApi) {}

  async getById(id: string): Promise<Post> {
    const response = await this.postApi.getById(id);
    return PostMapper.toEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await this.postApi.getList({
      pageIndex: page,
      pageSize: pageSize,
    });
    return {
      items: response.items.map(PostMapper.toEntity),
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pageSize),
    };
  }

  async getFollowedUsersPosts(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await this.postApi.getFollowedUsersPosts(userId, {
      pageIndex: page,
      pageSize: pageSize,
    });
    return {
      items: response.items.map(PostMapper.toEntity),
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pageSize),
    };
  }

  async create(post: Post): Promise<Post> {
    const dto = {
      contentText: post.contentText,
      userId: post.userId,
    };
    const response = await this.postApi.create(dto);
    return PostMapper.toEntity(response);
  }

  async update(post: Post): Promise<Post> {
    const dto = {
      id: post.id,
      contentText: post.contentText,
    };
    const response = await this.postApi.update(dto);
    return PostMapper.toEntity(response);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.postApi.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
