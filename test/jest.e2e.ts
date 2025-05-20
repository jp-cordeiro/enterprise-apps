import cofing from './jest.shared';
export default {
  ...cofing,
  testMatch: ['<rootDir>/**/*.e2e-(spec|test).ts'],
  testTimeout: 30000,
};
