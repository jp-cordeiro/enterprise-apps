import { BillingModule } from '@billingModule/billing.module';
import { PlanInterval, PlanModel } from '@billingModule/core/models/plan.model';
import { SubscriptionStatus } from '@billingModule/core/models/subscription.model';
import { PlanRepository } from '@billingModule/persistence/repositories/plan.repository';
import { SubscriptionRepository } from '@billingModule/persistence/repositories/subscription.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { createNestApp } from '@testInfra/test-e2e.setup';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('Subscription e2e test', () => {
  let app: INestApplication;
  let module: TestingModule;
  let planRepository: PlanRepository;
  let subscriptionRepository: SubscriptionRepository;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([BillingModule]);
    app = nestTestSetup.app;
    module = nestTestSetup.module;

    planRepository = module.get<PlanRepository>(PlanRepository);
    subscriptionRepository = module.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'));
  });

  afterEach(async () => {
    await subscriptionRepository.deleteAll();
    await planRepository.deleteAll();
  });

  afterAll(async () => {
    //TODO move it to be shared
    await app.close();
    module.close();
  });

  it('creates a subscription', async () => {
    const plan = PlanModel.create({
      name: 'Basic',
      description: 'Basic montly plan',
      currency: 'USD',
      amount: '10',
      interval: PlanInterval.Month,
      trialPeriod: 7,
    });
    await planRepository.create(plan);
    const res = await request(app.getHttpServer())
      .post('/subscription')
      .send({ planId: plan.id });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      userId: 'user-id',
      planId: plan.id,
      status: SubscriptionStatus.Active,
      startDate: expect.any(String),
      autoRenew: true,
    });
  });

  it('throws error if the plan does not exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/subscription')
      .send({ planId: randomUUID() });
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
  });
});
