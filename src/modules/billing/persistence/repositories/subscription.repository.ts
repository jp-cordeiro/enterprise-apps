import { Inject, Injectable } from '@nestjs/common';
import { DrizzleDefaultRepository } from '@sharedModules/drizzle/drizzle-default.repository';
import { eq, InferSelectModel } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { subscriptionsTable } from '../database.schema';
import { SubscriptionModel } from '@billingModule/core/models/subscription.model';
import * as schema from '@billingModule/persistence/database.schema';

@Injectable()
export class SubscriptionRepository extends DrizzleDefaultRepository<
  SubscriptionModel,
  typeof subscriptionsTable
> {
  constructor(
    @Inject('DB_POSTGRES')
    protected readonly db: PostgresJsDatabase<typeof schema>,
  ) {
    super(db, subscriptionsTable);
  }

  async findByUserId(userId: string): Promise<SubscriptionModel | null> {
    const res = await this.db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, userId))
      .limit(1);
    if (res.length === 0) return null;
    return this.mapToModel(res[0]);
  }

  protected mapToModel(
    data: InferSelectModel<typeof subscriptionsTable>,
  ): SubscriptionModel {
    return SubscriptionModel.createFrom(data as SubscriptionModel);
  }
}
