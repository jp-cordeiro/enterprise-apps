import { Prisma } from '@prisma/client';
import {
  PersistenceClientException,
  PersistenceInternalException,
} from '@sharedLibs/core/exception/storage.exception';

export abstract class DefaultPrismaRepository {
  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new PersistenceClientException(errorMessage);
    }
    throw new PersistenceInternalException(errorMessage);
  }
}
