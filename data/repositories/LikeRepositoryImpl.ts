import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { Like } from "../../domain/entities/Like";
import LikeApi from "../datasources/remote/LikeApi";
import { LikeMapper } from "../mappers/LikeMapper";

export class LikeRepositoryImpl implements ILikeRepository {
  constructor(private likeApi: typeof LikeApi) {}

  async create(like: Like): Promise<Like> {
    const command = LikeMapper.toCreateCommand(like);
    const response = await this.likeApi.create(command);
    return LikeMapper.toEntity(response);
  }

  async update(like: Like): Promise<Like> {
    const command = LikeMapper.toUpdateCommand(like);
    const response = await this.likeApi.update(command);

    // Type safe update - original like'ın createdDate'ini koruyoruz
    return {
      ...like,
      id: response.id,
      userId: response.userId,
      postId: response.postId || undefined,
      commentId: response.commentId || undefined,
      // createdDate original'den korunur, updatedDate response'dan gelir ama Like entity'sinde yok
    };
  }

  async delete(id: string): Promise<boolean> {
    await this.likeApi.delete(id);
    return true;
  }

  async getById(id: string): Promise<Like> {
    const response = await this.likeApi.getById(id);
    return LikeMapper.toEntity(response);
  }

  async getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }> {
    const response = await this.likeApi.getList({
      pageIndex: page,
      pageSize: pageSize,
    });

    return {
      items: response.items.map(LikeMapper.toEntity),
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pageSize),
    };
  }

  // Bu method'lar API'de mevcut olmadığı için basit implementasyon
  async getPostLikes(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }> {
    // API'de post-specific like endpoint'i olmadığı için
    // şimdilik boş response döndürüyoruz
    return {
      items: [],
      totalCount: 0,
      totalPages: 0,
    };
  }

  async getCommentLikes(
    commentId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }> {
    // API'de comment-specific like endpoint'i olmadığı için
    // şimdilik boş response döndürüyoruz
    return {
      items: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}
