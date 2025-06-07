import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    user: User,
    updates: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      bio?: string;
      dateOfBirth?: Date;
    }
  ): Promise<User> {
    if (!user || !user.id) {
      throw new Error("Geçerli bir kullanıcı gereklidir");
    }

    // Güncellenecek alanları kontrol et
    if (updates.userName && updates.userName.trim().length < 3) {
      throw new Error("Kullanıcı adı en az 3 karakter olmalıdır");
    }

    // User entity'sini güncelle
    const updatedUser: User = {
      ...user,
      firstName: updates.firstName ?? user.firstName,
      lastName: updates.lastName ?? user.lastName,
      userName: updates.userName ?? user.userName,
      bio: updates.bio ?? user.bio,
      dateOfBirth: updates.dateOfBirth ?? user.dateOfBirth,
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.userRepository.updateFromAuth(updatedUser);
  }
}
