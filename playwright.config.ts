// playwright.config.ts
module.exports = {
  globalSetup: require.resolve('./global-setup'),
  reporter: [['list'], ['html']],
  retries: 0,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
    trace: 'on'
  }
}
