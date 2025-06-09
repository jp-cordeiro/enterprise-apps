import { UserRepository } from '@identityModule/persistence/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserUnauthorizedException } from '../exception/user-unauthorized.exception';
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interfaces/billing-integration.interface';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(BillingSubscriptionStatusApi)
    private readonly subscriptionServiceClient: BillingSubscriptionStatusApi,
  ) {}

  private async comparePassword(
    password: string,
    actualPassword: string,
  ): Promise<boolean> {
    return compare(password, actualPassword);
  }

  private async isSubscriptionActive(
    userId: string,
    email: string,
  ): Promise<void> {
    const isSubscriptionActive =
      await this.subscriptionServiceClient.isUserSubscriptionActive(userId);
    if (!isSubscriptionActive) {
      throw new UserUnauthorizedException(
        `User subscription is not active: ${email}`,
      );
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UserUnauthorizedException(`Cannot authorize user: ${email}`);
    }
    await this.isSubscriptionActive(user.id, email);
    const payload = { sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        algorithm: 'HS256',
      }),
    };
  }
}
