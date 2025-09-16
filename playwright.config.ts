import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'scenarios',

  // Run all tests in parallel.
  fullyParallel: true,
  // Use all workers.
  workers: '100%',

  retries: 0,

  // Reporter to use
  reporter: [['list', { printSteps: true }], ['html']],

  use: {
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
