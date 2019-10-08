const fs = require('fs')
const dotenv = require('dotenv')
const rollup = require('rollup')
const _ = require('lodash')

const RollupConfig = require('./config/index')
const parseConfig = require('./config/config.parser')
const utils = require('./utils/utils')
const defaultConfig = require('./config/config.default')
const {
  success,
  handleError
} = require('./utils/logger')

class ElfScripts {
  constructor (mode, envName) {
    const variables = this.loadEnv(envName)
    const isProdction = variables.NODE_ENV === 'production'

    this.mode = mode
    this.pkg = this.loadPkg()
    this.elfConfig = this.loadElfConfig(defaultConfig)
    this.elfConfig.name = this.elfConfig.name || utils.parseName(this.pkg.name)

    this.options = {
      pkg: this.pkg,
      variables,
      isProdction,
      esMode: mode === 'build',
      umdMode: mode === 'umd',
      iifeMode: mode === 'iife',
      serveMode: mode === 'serve'
    }
    this.rollupCfg = new RollupConfig(this.elfConfig, this.options, this.pkg)
  }

  loadElfConfig (defaultConfig) {
    let userConfig = utils.importCjsModule('elf.config.js')

    if (typeof userConfig === 'function') {
      userConfig = userConfig(this.mode)
    }

    return _.merge({}, defaultConfig, userConfig)
  }

  loadEnv (envName) {
    const path = utils.resolvePath(`.env.${envName}`)
    let variables = {}

    if (fs.existsSync(path)) {
      variables = dotenv.parse(fs.readFileSync(path))
    }

    for (const name in variables) {
      process.env[name] = variables[name]
    }
    variables.NODE_ENV = process.env.NODE_ENV = variables.NODE_ENV || process.env.NODE_ENV
    return variables
  }

  loadPkg () {
    return utils.importCjsModule('package.json')
  }

  async build (config) {
    const { inputs, outputs } = parseConfig(config)
    const bundle = await rollup.rollup(inputs)

    await Promise.all(outputs.map(output => bundle.write(output)))
    return bundle
  }

  async batchBuild (config) {
    const configs = Array.isArray(config) ? config : [config]
    let result = null

    for (const cfg of configs) {
      result = await this.build(cfg)
    }

    return result
  }

  async runBuild () {
    const rollupCfg = await this.rollupCfg.get()
    const result = await this.batchBuild(rollupCfg)
    const timing = result.getTimings()

    success(timing)
    return result
  }

  async runServe () {
    const { serveDir, watchOptions } = this.elfConfig
    const rollupCfg = await this.rollupCfg.get()
    const config = Array.isArray(rollupCfg) ? rollupCfg[0] : rollupCfg
    const { inputs, outputs } = parseConfig(config)
    const watcher = rollup.watch({
      ...inputs,
      output: outputs,
      watch: _.merge({}, {
        include: [
          `${utils.resolvePath(serveDir)}/**`
        ]
      }, watchOptions)
    })

    watcher.on('event', event => {
      const {
        code,
        duration
      } = event

      if (['ERROR', 'FATAL'].indexOf(code) !== -1) {
        handleError(event.error)
      } else if (code === 'BUNDLE_END') {
        success('构建成功！')
        success(`用时 ${duration / 1000} 秒！`)
      }
    })

    return watcher
  }
}

module.exports = ElfScripts
