module.exports = {
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
    trace: 'on-first-retry'
  },
  retries: 1
}
