// jest.config.ts
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/src/$1'
    },
    setupFiles: ['<rootDir>/test/setup.ts']
  };