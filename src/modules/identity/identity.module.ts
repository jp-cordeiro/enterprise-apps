import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  AuthService,
  jwtConstants,
} from './core/services/authentication.service';
import { AuthResolver } from './http/graphql/auth.resolver';
import { UserResolver } from './http/graphql/user.resolver';
import { UserManagementService } from './core/services/user-management.service';
import { UserRepository } from './persistence/user.repository';
import { ConfigModule } from '@sharedModules/config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaPersistenceModule } from '@sharedModules/prisma/prisma-persistence.module';
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interfaces/billing-integration.interface';
import { BillingSubscriptionRepository } from './persistence/external/billing-subscription.repository';
import { BillingPublicApiProvider } from '@billingModule/provider/public-api.provider';
import { BillingModule } from '@billingModule/billing.module';
import { DomainIntegrationModule } from '@sharedModules/integration/domain-integration.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    PrismaPersistenceModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    DomainIntegrationModule,
    BillingModule,
  ],
  providers: [
    {
      provide: BillingSubscriptionStatusApi,
      useExisting: BillingPublicApiProvider,
      // useExisting: BillingSubscriptionHttpClient,
      // useExisting: BillingSubscriptionRepository,
    },
    AuthService,
    AuthResolver,
    UserResolver,
    UserManagementService,
    UserRepository,
    BillingSubscriptionRepository,
  ],
})
export class IdentityModule {}
