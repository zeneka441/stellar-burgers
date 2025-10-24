import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  // Среда для тестирования React компонентов
  testEnvironment: 'jsdom',

  // Как обрабатывать TypeScript файлы
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // Где искать тесты
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.(ts|tsx)',
    '<rootDir>/src/**/*.test.(ts|tsx)'
  ],

  // Настройка путей для импортов (как в tsconfig)
  moduleNameMapper: {
    '^@api(.*)$': '<rootDir>/src/utils/burger-api$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },

  // Настройка тестовой среды
  setupFilesAfterEnv: ['@testing-library/jest-dom']
};

export default config;
