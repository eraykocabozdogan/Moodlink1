import { IAuthRepository } from "../../repositories/IAuthRepository";
import { User } from "../../entities/User";

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    user: Omit<User, "id" | "followers" | "following" | "createdDate">,
    password: string
  ): Promise<{ accessToken: string; user: User }> {
    return await this.authRepository.register(user, password);
  }
}
