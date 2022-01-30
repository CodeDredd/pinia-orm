module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/pinia-orm/src/**/*.ts',
    'packages/testing/src/**/*.ts',
    '!packages/testing/**/*.spec.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.ts',
    '\\.d\\.ts$',
    'src/devtools',
    'src/hmr',
    'src/deprecated.ts',
    'src/vue2-plugin.ts',
  ],
  testMatch: [
    '<rootDir>/packages/pinia-orm/__tests__/**/*.spec.ts',
    '<rootDir>/packages/testing/**/*.spec.ts',
  ],
  transform: {
    '^.+\\.tsx?$': '@sucrase/jest-plugin',
  },
  moduleNameMapper: {
    '^@pinia-orm/(.*?)$': '<rootDir>/packages/$1/src',
    '^pinia-orm$': '<rootDir>/packages/pinia-orm/src',
  },
  rootDir: __dirname,
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
}
