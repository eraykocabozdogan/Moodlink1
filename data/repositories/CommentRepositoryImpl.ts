import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { Comment } from "../../domain/entities/Comment";
import CommentApi from "../datasources/remote/CommentApi";
import { CommentMapper } from "../mappers/CommentMapper";
import { GetCommentsUseCaseParams } from "../../domain/usecases/comment/GetCommentsUseCase";

export class CommentRepositoryImpl implements ICommentRepository {
  constructor(private commentApi: typeof CommentApi) {}

  async create(comment: Comment): Promise<Comment> {
    const command = CommentMapper.toCreateCommand(comment);
    const response = await this.commentApi.create(command);
    // The create response doesn't contain the full user object,
    // so we return a partial entity.
    return CommentMapper.toEntity(response);
  }

  async update(comment: Comment): Promise<Comment> {
    const command = CommentMapper.toUpdateCommand(comment);
    const response = await this.commentApi.update(command);

    return {
      ...comment,
      content: response.content || comment.content,
      updatedAt: new Date(response.updatedDate),
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.commentApi.delete(id);
    return true;
  }

  async getById(id: string): Promise<Comment> {
    const response = await this.commentApi.getById(id);
    return CommentMapper.detailedToEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Comment[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await this.commentApi.getList({
      pageIndex: page,
      pageSize: pageSize,
    });

    return {
      items: response.items.map(CommentMapper.listItemToEntity),
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pageSize),
    };
  }

  async getPostComments(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Comment[];
    totalCount: number;
    totalPages: number;
  }> {
    // Get all comments and filter by postId
    const response = await this.commentApi.getList({
      pageIndex: 1,
      pageSize: 1000, // Get a large number to include all comments
    });

    // Filter comments by postId
    const filteredComments = response.items.filter(
      (comment) => comment.postId === postId
    );

    // Apply pagination to filtered results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    return {
      items: paginatedComments.map(CommentMapper.listItemToEntity),
      totalCount: filteredComments.length,
      totalPages: Math.ceil(filteredComments.length / pageSize),
    };
  }

  async getComments(params: GetCommentsUseCaseParams): Promise<Comment[]> {
    const response = await CommentApi.getCommentsByPostId(params.postId);
    return response.comments.map(CommentMapper.toEntity);
  }

  async addComment(comment: Comment): Promise<Comment> {
    const command = CommentMapper.toCreateCommand(comment);
    const response = await this.commentApi.create(command);
    return CommentMapper.toEntity(response);
  }
}
