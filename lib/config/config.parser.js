const inputOptions = [
  // core input options
  'external',
  'input', // required
  'plugins',

  // advanced input options
  'cache',
  'inlineDynamicImports',
  'manualChunks',
  'onwarn',
  'preserveModules',
  'strictDeprecations',

  // danger zone
  'acorn',
  'acornInjectPlugins',
  'context',
  'moduleContext',
  'preserveSymlinks',
  'shimMissingExports',
  'treeshake',

  // experimental
  'chunkGroupingSize',
  'experimentalCacheExpiry',
  'experimentalOptimizeChunks',
  'experimentalTopLevelAwait',
  'perf'
]

function parse (config, fields) {
  const result = {}

  fields.forEach(field => {
    if (field in config) {
      result[field] = config[field]
    }
  })

  return result
}

module.exports = function parseConfig (config) {
  return {
    inputs: parse(config, inputOptions),
    outputs: config.output
  }
}
