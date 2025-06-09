import { Injectable } from '@nestjs/common';
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interfaces/billing-integration.interface';
import { DefaultPrismaRepository } from '@sharedModules/prisma/default.prisma.repository';
import { PrismaService } from '@sharedModules/prisma/prisma.service';

@Injectable()
export class BillingSubscriptionRepository
  extends DefaultPrismaRepository
  implements BillingSubscriptionStatusApi
{
  private readonly model: PrismaService['subscription'];
  constructor(prismaService: PrismaService) {
    super();
    this.model = prismaService.subscription;
  }

  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const subscription = await this.model.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
        },
      });
      return !!subscription;
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }
}
