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
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const html = require('rollup-plugin-fill-html')
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
    this.isMultiEntry = typeof entry !== 'string'
    // 入口为文件夹时，该文件下的模块都被视为互相独立的rollup入口
    this.isInnerMulti = !this.isMultiEntry && utils.isDirectory(entry)
  }

  async get () {
    const { elfConfig, options } = this
    const entry = await this.entry()
    const { configureRollup } = elfConfig
    const { serveMode } = options
    let config = {
      input: entry,
      output: this.output(),
      external: !serveMode ? this.pkgExternal() : null,
      plugins: this.plugins(),
      perf: true
    }

    if (typeof configureRollup === 'function') {
      config = configureRollup(config)
    } else if (Array.isArray(configureRollup)) {
      config = configureRollup.map(cfg => _.merge({}, config, cfg))
    } else if (configureRollup && typeof configureRollup === 'object') {
      config = _.merge({}, config, configureRollup)
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

  output () {
    const { elfConfig, options } = this
    const { name, serveDir, outputDir, modes } = elfConfig
    const { serveMode, umdMode, iifeMode } = options
    const file = serveMode
      ? utils.resolvePath(`${serveDir}/${name}.js`)
      : utils.resolvePath(`${outputDir}/${name}${umdMode ? '.umd' : ''}.js`)
    const cname = utils.camel(name)
    const format = umdMode ? 'umd' : (serveMode || iifeMode ? 'iife' : modes)
    const formats = typeof format === 'string' ? [format] : format

    return formats.map(format => {
      const output = {
        name: cname,
        exports: 'named',
        format
      }

      if (this.isInnerMulti || this.isMultiEntry) {
        output.dir = outputDir
      } else {
        output.file = file
      }

      return output
    })
  }

  pkgExternal () {
    const { pkg, esMode } = this.options
    const dependencies = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies))

    return id => {
      const matchs = dependencies.filter(dep => {
        return id === dep || (esMode && new RegExp(`^${dep}/`).test(id))
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
      pluginOptions
    } = elfConfig
    const { variables, serveMode, umdMode, iifeMode } = options
    let extract = true

    if (serveMode) {
      extract = utils.resolvePath(`${serveDir}/${name}.css`)
    } else if (umdMode) {
      extract = utils.resolvePath(`${outputDir}/${name}.umd.css`)
    } else if (iifeMode) {
      extract = utils.resolvePath(`${outputDir}/${name}.css`)
    }

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
      ...beforePlugin(pluginOptions.alias, alias),
      ...beforePlugin(pluginOptions.resolve, resolve),
      ...beforePlugin(pluginOptions.postcss, cfg => {
        return postcss(
          _.merge({
            extract,
            minimize: (umdMode || iifeMode)
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
      ...beforePlugin(pluginOptions.vue, vue),
      ...beforePlugin(pluginOptions.typescript2, cfg => {
        return typescript(
          _.merge({
            useTsconfigDeclarationDir: true
          }, cfg)
        )
      }),
      babel(this.babelOption()),
      ...beforePlugin((umdMode || iifeMode) && pluginOptions.terser, terser),
      ...beforePlugin(pluginOptions.visualizer, visualizer),
      ...beforePlugin(pluginOptions.progress, cfg => {
        return progress(
          _.merge({
            clearLine: false
          }, cfg)
        )
      }),
      ...beforePlugin(serveMode && pluginOptions.html, cfg => {
        return html(
          _.merge({
            template: `${serveDir}/template.html`,
            filename: 'index.html'
          }, cfg)
        )
      }),
      ...beforePlugin(serveMode && pluginOptions.serve, cfg => {
        return serve(
          _.merge({
            open: true,
            contentBase: [serveDir]
          }, cfg)
        )
      }),
      ...beforePlugin(serveMode && pluginOptions.livereload, cfg => {
        return livereload(
          _.merge({
            watch: [utils.resolvePath(serveDir)]
          }, cfg)
        )
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
