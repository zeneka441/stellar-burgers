import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,

    viewportWidth: 1280,
    viewportHeight: 720,

    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',

    setupNodeEvents(on, config) {}
  }
});
