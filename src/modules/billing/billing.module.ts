import { Module } from '@nestjs/common';
import { BillingPersistenceModule } from './persistence/billing-persistence.module';
import { SubscriptionService } from './core/services/subscription.service';
import { SubscriptionController } from './http/rest/controller/subscription.controller';
import { BillingPublicApiProvider } from './provider/public-api.provider';

@Module({
  imports: [BillingPersistenceModule],
  providers: [SubscriptionService, BillingPublicApiProvider],
  controllers: [SubscriptionController],
  exports: [BillingPublicApiProvider],
})
export class BillingModule {}
