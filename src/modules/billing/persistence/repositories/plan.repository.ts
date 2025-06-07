import { PlanModel } from '@billingModule/core/models/plan.model';
import { Inject, Injectable } from '@nestjs/common';
import { DrizzleDefaultRepository } from '@sharedModules/drizzle/drizzle-default.repository';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@billingModule/persistence/database.schema';
import { plansTable } from '@billingModule/persistence/database.schema';
import { InferSelectModel } from 'drizzle-orm';

@Injectable()
export class PlanRepository extends DrizzleDefaultRepository<
  PlanModel,
  typeof plansTable
> {
  constructor(
    @Inject('DB_POSTGRES')
    protected readonly db: PostgresJsDatabase<typeof schema>,
  ) {
    super(db, plansTable);
  }

  protected mapToModel(data: InferSelectModel<typeof plansTable>): PlanModel {
    return PlanModel.createFrom(data as PlanModel);
  }
}
