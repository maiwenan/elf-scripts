const path = require('path')

const progress = require('rollup-plugin-progress')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const alias = require('rollup-plugin-alias')
const postcss = require('rollup-plugin-postcss')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const visualizer = require('rollup-plugin-visualizer')
const { terser } = require('rollup-plugin-terser')
const _ = require('lodash')

const utils = require('../utils/utils')

const beforePlugin = (cfg, fn) => {
  const result = []

  if (cfg && typeof cfg === 'object') {
    return [fn(cfg)]
  }

  return result
}

class Config {
  constructor (elfConfig, options, pkg) {
    const { entry } = elfConfig

    this.elfConfig = elfConfig
    this.options = options
    this.pkg = pkg
    this.isOuterMulti = typeof entry !== 'string'
    // 入口为文件夹时，该文件件下的模块都被视为互相独立的rollup入口
    this.isInnerMulti = !this.isOuterMulti && utils.isDirectory(entry)
  }

  async get () {
    const { elfConfig, isInnerMulti } = this
    const entry = await this.entry()
    const paths = isInnerMulti ? this.paths(entry) : []
    const { configureRollup } = elfConfig
    let config = {
      input: entry,
      output: this.output(paths),
      external: isInnerMulti ? this.entryExternal(paths) : null,
      plugins: this.plugins()
    }

    if (typeof configureRollup === 'function') {
      config = configureRollup(config)
    } else if (configureRollup && typeof configureRollup === 'object') {
      config = _.merge(config, configureRollup)
    }

    return config
  }

  async entry () {
    const { entry } = this.elfConfig

    if (this.isInnerMulti) {
      const result = utils.readEntryModule(utils.resolvePath(entry))

      return result
    }
    return entry
  }

  output (paths) {
    const { elfConfig, options } = this
    const { name, serveDir, outputDir, modes } = elfConfig
    const { serveMode, umdMode, iifeMode } = options
    const file = serveMode
      ? utils.resolvePath(`${serveDir}/${name}.js`)
      : utils.resolvePath(`${outputDir}/${name}${umdMode ? '.umd' : ''}.js`)
    const format = umdMode ? 'umd' : (iifeMode ? 'iife' : modes)
    const output = {
      name: utils.camel(name),
      exports: 'named',
      format,
      paths
    }

    if (this.isInnerMulti || this.isOuterMulti) {
      output.dir = outputDir
    } else {
      output.file = file
    }
    return output
  }

  paths (entry) {
    const { elfConfig, pkg } = this
    const { outputDir } = elfConfig

    return Object.keys(entry).reduce((prev, key) => {
      prev[key] = path.normalize(`${pkg.name}/${outputDir}/${key}`)
      return prev
    }, {})
  }

  entryExternal (paths) {
    return (id, parent) => {
      const list = Object.keys(paths)

      return this.pkgExternal()(id) || (list.indexOf(id) > -1 && parent)
    }
  }

  pkgExternal () {
    const { pkg } = this.options
    const dependencies = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies))

    return (id) => {
      const matchs = dependencies.filter(dep => {
        const re = new RegExp(`^${dep}`)

        return re.test(id)
      })

      return matchs.length > 0
    }
  }

  plugins () {
    const { elfConfig, options } = this
    const {
      name,
      serveDir,
      outputDir,
      styleDir,
      pluginOptions
    } = elfConfig
    const { variables, serveMode, umdMode } = options
    const extract = serveMode
      ? utils.resolvePath(`${serveDir}/${name}.css`)
      : utils.resolvePath(`${outputDir}/${styleDir}/${name}${umdMode ? '.umd' : ''}.css`)

    const plugins = [
      ...beforePlugin(pluginOptions.replace, cfg => {
        const vars = Object.keys(variables).reduce((prev, curr) => {
          prev[`process.env.${curr}`] = JSON.stringify(variables[curr])
          return prev
        }, {})

        return replace(
          _.merge(vars, cfg)
        )
      }),
      ...beforePlugin(pluginOptions.alias, cfg => alias(cfg)),
      ...beforePlugin(pluginOptions.resolve, cfg => resolve(cfg)),
      ...beforePlugin(pluginOptions.postcss, cfg => {
        return postcss(
          _.merge({
            extract: true,
            minimize: umdMode
          }, cfg)
        )
      }),
      ...beforePlugin(pluginOptions.commonjs, cfg => {
        return commonjs(
          _.merge({
            exclude: [utils.resolvePath('src/**')]
          }, cfg)
        )
      }),
      ...beforePlugin(pluginOptions.vue, cfg => vue(cfg)),
      ...beforePlugin(pluginOptions.typescript2, cfg => {
        return typescript(
          _.merge({
            useTsconfigDeclarationDir: true
          }, cfg)
        )
      }),
      babel(this.babelOption()),
      // terser(),
      visualizer(),
      progress({
        clearLine: false // default: true
      })
    ]

    return plugins
  }

  babelOption () {
    let babelConfig = utils.importCjsModule('babel.config.js')

    babelConfig = _.merge({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.ts', '.tsx']
    }, babelConfig)
    return babelConfig
  }
}

module.exports = Config