import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from '../user-management.service';
import { UserRepository } from '@identityModule/persistence/user.repository';
import { ConfigModule } from '@sharedModules/config/config.module';
import { PrismaService } from '@sharedModules/prisma/prisma.service';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [UserManagementService, UserRepository, PrismaService],
    }).compile();

    service = module.get<UserManagementService>(UserManagementService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('creates a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce();

      const createdUser = await service.create(user);
      const { email, firstName, lastName } = createdUser;

      expect(email).toEqual(user.email);
      expect(firstName).toEqual(user.firstName);
      expect(lastName).toEqual(user.lastName);
    });
  });
});
