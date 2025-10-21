module.exports = {
  testEnvironment: "node",

  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",

  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],

  testPathIgnorePatterns: ["/node_modules/", "/mongo-data/"],

  clearMocks: true,
  testTimeout: 10000,
};
