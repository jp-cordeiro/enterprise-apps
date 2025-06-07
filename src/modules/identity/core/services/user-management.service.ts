import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { hash } from 'bcrypt';
import { UserRepository } from '@identityModule/persistence/user.repository';
import { CreateUserInput } from '@identityModule/http/graphql/types/create-user-input.type';

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class UserManagementService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserInput: CreateUserInput): Promise<UserModel> {
    const newUser = UserModel.create({
      ...createUserInput,
      password: await hash(createUserInput.password, PASSWORD_HASH_SALT),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
