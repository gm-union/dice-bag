const { merge } = require('lodash')
const rimraf = require('rimraf')
const path = require('path')

const withGraphQL = require('next-plugin-graphql')

const {
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
  PHASE_DEVELOPMENT_SERVER
} = require('next/constants')
const { convertCompilerOptionsFromJson } = require('typescript')

const isGraphQl = ((isGraphQl, filepath) => isGraphQl && filepath.matches(/\.graphql$/))

class WatchRunPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('WatchRun', (comp, done) => {
      const changedTimes = comp.watchFileSystem.watcher.mtimes;
      const changedGraphQLFiles = Object.keys(changedTimes).reduce(isGraphQl, false)

      if (changedGraphQLFiles.length) {
        console.log('GraphQL file update. Clearing cache')
        return rimraf('./node_modules/.cache/babel-loader', done)
      }
    });
  }
}

const commonSettings = withGraphQL({
  webpack: (config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(new WatchRunPlugin())

    // Resolution order preference
    config.resolve.extensions.push('.graphql')
    config.resolve.extensions.push('.gql')

    // Set up module aliases
    config.resolve.alias["@/components"] = path.resolve(__dirname, 'components')
    config.resolve.alias["@/lib"] = path.resolve(__dirname, './lib')
    config.resolve.alias["@/pages"] = path.resolve(__dirname, './pages')
    config.resolve.alias["@/apollo"] = path.resolve(__dirname, './apollo')
    config.resolve.alias["@/resolvers"] = path.resolve(__dirname, "./apollo/resolvers")
    config.resolve.alias["@/models"] = path.resolve(__dirname, "./apollo/models")
    config.resolve.alias["@/schemas"] = path.resolve(__dirname, "./schemas")
    config.resolve.alias["@/static"] = path.resolve(__dirname, "./static")
    config.resolve.alias["@/root"] = __dirname

    // Add support for .graphql and .gql files

    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-let/loader' }, defaultLoaders.babel ],
    })

    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: ['graphql-tag/loader', 'graphql-let/schema/loader'],
    })

    return config
  },
  // webpackDevMiddleware: (config) => {
  //   // Perform customizations to webpack dev middleware config
  //   // Important: return the modified config
  //   return config
  // },
})

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return merge(defaultConfig, commonSettings)
  }

  return merge(defaultConfig, commonSettings)
}
