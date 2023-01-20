// playwright.config.js
// @ts-check
import * as dotenv from "dotenv";
dotenv.config();

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Look for test files in the "tests" directory, relative to this configuration file
  testDir: "e2e",

  // Each test is given 30 seconds
  timeout: 30000,

  // Forbid test.only on CI
  forbidOnly: !!process.env.CI,

  // Two retries for each test
  retries: 2,

  fullyParallel: true,

  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,

  webServer: {
    command: "npm run dev",
    port: 3000,
    timeout: 120 * 1000,
  },

  use: {
    testIdAttribute: 'test-id'
  },
};

module.exports = config;