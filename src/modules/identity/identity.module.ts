import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  AuthService,
  jwtConstants,
} from './core/services/authentication.service';
import { PersistenceModule } from '@contentModule/persistence/persistence.module';
import { AuthResolver } from './http/graphql/auth.resolver';
import { UserResolver } from './http/graphql/user.resolver';
import { UserManagementService } from './core/services/user-management.service';
import { UserRepository } from './persistence/user.repository';
import { PrismaService } from '@sharedModules/prisma/prisma.service';
import { ConfigModule } from '@sharedModules/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    PersistenceModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserResolver,
    UserManagementService,
    UserRepository,
    PrismaService,
  ],
})
export class IdentityModule {}
