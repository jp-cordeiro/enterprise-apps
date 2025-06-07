import { Module } from '@nestjs/common';
import * as billingSchema from './database.schema';
import { PlanRepository } from './repositories/plan.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { DrizzlePersistenceModule } from '@sharedModules/drizzle/drizzle-persistence.module';

@Module({
  imports: [DrizzlePersistenceModule.forRoot(billingSchema)],
  providers: [PlanRepository, SubscriptionRepository],
  exports: [PlanRepository, SubscriptionRepository],
})
export class BillingPersistenceModule {}
