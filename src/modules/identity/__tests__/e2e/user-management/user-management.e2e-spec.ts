import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { Tables } from '@testInfra/enum/table.enum';
import { testDbClient } from '@testInfra/knex.database';
import request from 'supertest';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await testDbClient(Tables.User).del();
  });

  afterAll(async () => {
    await testDbClient(Tables.User).del();
    await module.close();
  });

  describe('Identity - createUser mutation', () => {
    it('should creates a new user', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createUser(CreateUserInput: {
                firstName: "${createUserInput.firstName}",
                lastName: "${createUserInput.lastName}",
                email: "${createUserInput.email}",
                password: "${createUserInput.password}"
              }) {
                id
                firstName
                lastName
                email
              }
            }
          `,
        });
      const { id, firstName, lastName, email } = response.body.data.createUser;

      expect(id).toBeDefined();
      expect(firstName).toBe(createUserInput.firstName);
      expect(lastName).toBe(createUserInput.lastName);
      expect(email).toBe(createUserInput.email);
    });
    it('should throws error for invalid email validation', async () => {
      const createUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createUser(CreateUserInput: {
                firstName: "${createUserInput.firstName}",
                lastName: "${createUserInput.lastName}",
                email: "${createUserInput.email}",
                password: "${createUserInput.password}"
              }) {
                id
                firstName
                lastName
                email
              }
            }
          `,
        })
        .expect(HttpStatus.OK);
      expect(response.body.errors[0].extensions.originalError.message[0]).toBe(
        `email must be an email`,
      );
    });
  });
});
