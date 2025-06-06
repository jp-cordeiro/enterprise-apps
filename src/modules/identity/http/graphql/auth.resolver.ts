import { AuthService } from '@identityModule/core/services/authentication.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './types/sign-in-input.type';
import { AuthToken } from './types/auth-token.type';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthToken)
  async signIn(
    @Args('SignInInput') signInInput: SignInInput,
  ): Promise<AuthToken> {
    const { email, password } = signInInput;
    try {
      const token = await this.authService.signIn(email, password);
      return token;
    } catch (error) {
      throw new UnauthorizedException('Cannot authorize user');
    }
  }
}
