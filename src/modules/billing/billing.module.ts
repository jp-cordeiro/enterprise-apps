import { Module } from '@nestjs/common';
import { BillingPersistenceModule } from './persistence/billing-persistence.module';
import { SubscriptionService } from './core/services/subscription.service';
import { SubscriptionController } from './http/rest/controller/subscription.controller';

@Module({
  imports: [BillingPersistenceModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [],
})
export class BillingModule {}
