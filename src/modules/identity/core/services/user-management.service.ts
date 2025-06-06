import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { DomainException } from '@sharedLibs/core/exception/domain.exception';
import bcrypt from 'bcrypt';
import { UserRepository } from '@identityModule/persistence/user.repository';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class UserManagementService {
  constructor(private readonly userRepository: UserRepository) {}
  private validateEmail(email: string): boolean {
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexPattern.test(email);
  }

  async getUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    if (!this.validateEmail(createUserDto.email)) {
      throw new DomainException(`Invalid email: ${createUserDto.email}`);
    }
    const newUser = UserModel.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, PASSWORD_HASH_SALT),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
