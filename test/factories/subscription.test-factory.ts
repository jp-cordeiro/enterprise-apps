import {
  SubscriptionModel,
  SubscriptionStatus,
} from '@billingModule/core/models/subscription.model';
import { faker } from '@faker-js/faker/.';
import * as Factory from 'factory.ts';

export const subscriptionFactory = Factory.Sync.makeFactory<SubscriptionModel>({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  planId: faker.string.uuid(),
  status: SubscriptionStatus.Active,
  startDate: faker.date.recent(),
  endDate: null,
  autoRenew: true,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
});
