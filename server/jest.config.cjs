module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',
  verbose: true,
  forceExit: true,
  testTimeout: 30000,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
}
