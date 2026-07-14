/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@backend/shared$': '<rootDir>/app/shared/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  coverageDirectory: './coverage',
  clearMocks: true,
  // projects: [
  //   '<rootDir>/app/services/auth-service',
  //   '<rootDir>/app/services/task-service',
  //   '<rootDir>/app/services/category-service',
  //   '<rootDir>/app/services/media-service',
  //   '<rootDir>/app/services/notification-service',
  // ],
};