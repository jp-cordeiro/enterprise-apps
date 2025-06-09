import { SubscriptionService } from '@billingModule/core/services/subscription.service';
import { Injectable } from '@nestjs/common';
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interfaces/billing-integration.interface';

@Injectable()
export class BillingPublicApiProvider implements BillingSubscriptionStatusApi {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    const isSubscription =
      await this.subscriptionService.isUserSubscriptionActive(userId);
    return isSubscription;
  }
}
