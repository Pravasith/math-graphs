const withSASS = require('@zeit/next-sass')

const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = withSASS(
    {
        webpack(config) {
          config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
      
          return config
        }
      }
)