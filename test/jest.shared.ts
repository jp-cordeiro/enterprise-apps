export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
    '^@testInfra/(.*)$': '<testInfra>/src/$1',
  },
  testEnvironment: 'node',
  verbose: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
