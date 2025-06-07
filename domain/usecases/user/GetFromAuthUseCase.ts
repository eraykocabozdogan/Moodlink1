import { IUserRepository } from "../../repositories/IUserRepository";
import { User } from "../../entities/User";

export class GetFromAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User> {
    return await this.userRepository.getFromAuth();
  }
}
