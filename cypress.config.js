const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "ed202401",
  video: true,
  screenshotOnRunFailure: true,
  env: {
    requestMode: true,
    hideCredentials: true,
    hideCredentialsOptions: {
      headers: ["x-jwt-token"],
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      const version = config.env.version || "dev";
      config.env = require(`./cypress/config/${version}.json`);
      config.baseUrl = config.env.baseUrl;
      return config;
    },
  },
});
