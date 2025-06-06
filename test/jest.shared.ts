export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  moduleNameMapper: {
    '^@contentModule/(.*)$': '<rootDir>/src/modules/content/$1',
    '^@identityModule/(.*)$': '<rootDir>/src/modules/identity/$1',
    '^@billingModule/(.*)$': '<rootDir>/src/modules/billing/$1',
    '^@sharedModules/(.*)$': '<rootDir>/src/modules/shared/modules/$1',
    '^@sharedLibs/(.*)$': '<rootDir>/src/modules/shared/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
    '^@testInfra/(.*)$': '<rootDir>/test/$1',
  },
  testEnvironment: 'node',
  verbose: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
