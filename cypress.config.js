const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  projectId: 'gnm9h2',
  video:true,
  screenshotOnRunFailure:true,
  e2e: {
    setupNodeEvents(on, config) {
      const version = config.env.version || 'dev'
      config.env = require(`./cypress/config/${version}.json`)
      config.baseUrl = config.env.baseUrl
      return config
    },
  },
})
