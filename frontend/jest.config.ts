import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};

export default config;
