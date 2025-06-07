import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class SearchUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    query: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    items: User[];
    totalCount: number;
    totalPages: number;
  }> {
    if (!query || query.trim().length === 0) {
      throw new Error("Arama sorgusu gereklidir");
    }

    if (query.trim().length < 2) {
      throw new Error("Arama sorgusu en az 2 karakter olmalıdır");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.userRepository.searchUsers(query, page, pageSize);
  }
}
