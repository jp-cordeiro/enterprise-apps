import { UserModel } from '@identityModule/core/models/user.model';
import { UserManagementService } from '@identityModule/core/services/user-management.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@sharedModules/prisma/prisma.service';
import { AppModule } from '@src/app.module';
import request from 'supertest';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let userManagementService: UserManagementService;
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    userManagementService = module.get<UserManagementService>(
      UserManagementService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await prismaService.user.deleteMany();
    await module.close();
  });

  describe('signIn mutation', () => {
    it('should returns accessToken for valid credentials', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      await userManagementService.create(
        UserModel.create({
          firstName: 'John',
          lastName: 'Doe',
          email: signInInput.email,
          password: signInInput.password,
        }),
      );

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.data.signIn.accessToken).toBeDefined();
    });
    it('should returns unauthorized if the user does not exist', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `,
        })
        .expect(200);
      expect(response.body.errors[0].message).toEqual('Cannot authorize user');
    });
  });
  describe('getProfile query', () => {
    it('should returns the authenticated user', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      await userManagementService.create(
        UserModel.create({
          firstName: 'John',
          lastName: 'Doe',
          email: signInInput.email,
          password: signInInput.password,
        }),
      );

      const acessTokenResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              signIn(SignInInput: {
                email: "${signInInput.email}",
                password: "${signInInput.password}"
              }) {
                accessToken
              }
            }
          `,
        });
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set(
          'Authorization',
          `Bearer ${acessTokenResponse.body.data.signIn.accessToken}`,
        )
        .send({
          query: `
            query {
              getProfile {
                email
              }
            }
          `,
        });

      const { email } = response.body.data.getProfile;

      expect(email).toEqual(signInInput.email);
    });
    it('should returns unauthorized for invalid tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer fake-token`)
        .send({
          query: `
            query {
              getProfile {
                email
              }
            }
          `,
        });

      expect(response.body.errors[0].message).toEqual('Unauthorized');
    });
  });
});
