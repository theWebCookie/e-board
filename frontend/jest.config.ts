import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@config': '<rootDir>/../config.js',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};

export default config;
