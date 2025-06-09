import { UserModel } from '@identityModule/core/models/user.model';
import { UserManagementService } from '@identityModule/core/services/user-management.service';
import { IdentityModule } from '@identityModule/identity.module';

import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '@sharedModules/prisma/prisma.service';
import { Tables } from '@testInfra/enum/table.enum';
import { planFactory } from '@testInfra/factories/plan.test-factory';
import { subscriptionFactory } from '@testInfra/factories/subscription.test-factory';
import { testDbClient } from '@testInfra/knex.database';
import { createNestApp } from '@testInfra/test-e2e.setup';
import request from 'supertest';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let userManagementService: UserManagementService;
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([IdentityModule]);
    app = nestTestSetup.app;
    module = nestTestSetup.module;

    userManagementService = module.get<UserManagementService>(
      UserManagementService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await testDbClient(Tables.Subscription).del();
    await testDbClient(Tables.Plan).del();
  });
  afterAll(async () => {
    await prismaService.user.deleteMany();
    await testDbClient(Tables.Subscription).del();
    await testDbClient(Tables.Plan).del();
    await module.close();
  });

  describe('signIn mutation', () => {
    it('returns accessToken for valid credentials', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const createdUser = await userManagementService.create(
        UserModel.create({
          firstName: 'John',
          lastName: 'Doe',
          email: signInInput.email,
          password: signInInput.password,
        }),
      );

      const plan = planFactory.build();
      const subscription = subscriptionFactory.build({
        planId: plan.id,
        status: 'ACTIVE' as any,
        userId: createdUser.id,
      });
      await testDbClient(Tables.Plan).insert(plan);
      await testDbClient(Tables.Subscription).insert(subscription);

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
    it('returns unauthorized if the user does not exist', async () => {
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
    it('returns the authenticated user', async () => {
      const signInInput = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const createdUser = await userManagementService.create(
        UserModel.create({
          firstName: 'John',
          lastName: 'Doe',
          email: signInInput.email,
          password: signInInput.password,
        }),
      );

      const plan = planFactory.build();
      const subscription = subscriptionFactory.build({
        planId: plan.id,
        status: 'ACTIVE' as any,
        userId: createdUser.id,
      });
      await testDbClient(Tables.Plan).insert(plan);
      await testDbClient(Tables.Subscription).insert(subscription);

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
    it('returns unauthorized for invalid tokens', async () => {
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
