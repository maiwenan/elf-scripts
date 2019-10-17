const fs = require('fs')
const dotenv = require('dotenv')
const rollup = require('rollup')
const _ = require('lodash')

const Config = require('./config/index')
const { parseConfig } = require('./config/config.parser')
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
    this.options = {
      pkg: this.pkg,
      variables,
      isProdction,
      esMode: mode === 'build',
      umdMode: mode === 'umd',
      iifeMode: mode === 'iife',
      serveMode: mode === 'serve'
    }

    const {
      config,
      options
    } = this.loadElfConfig(defaultConfig, this.pkg)
    this.elfConfig = config
    this.rollupOptions = options
  }

  loadElfConfig (defaultConfig, pkg) {
    let userConfig = utils.importCjsModule('elf.config.js')
    let options = []
    let config = null

    if (typeof userConfig === 'function') {
      userConfig = userConfig(this.mode)
    }
    config = _.merge({}, defaultConfig, userConfig)
    config.name = config.name || utils.parseName(pkg.name)

    if (Array.isArray(config.modules) && config.module.length > 0) {
      options = config.modules.map(opt => _.merge({}, config, opt))
    } else {
      options = [config]
    }

    return {
      config,
      options
    }
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

  async build (opt) {
    const rollupCfg = new Config(opt, this.options, this.pkg)
    const config = await rollupCfg.get()
    const { inputs, outputs } = parseConfig(config)
    const bundle = await rollup.rollup(inputs)

    await Promise.all(outputs.map(output => bundle.write(output)))
    return bundle
  }

  async batchBuild (options) {
    let result = null

    for (const opt of options) {
      result = await this.build(opt)
    }

    return result
  }

  async runBuild () {
    const result = await this.batchBuild(this.rollupOptions)
    const timing = result.getTimings()

    success(timing)
    return result
  }

  async runServe () {
    const opt = this.rollupOptions[0]
    const { serveDir, watchOptions } = opt
    const rollupCfg = new Config(opt, this.options, this.pkg)
    const config = await rollupCfg.get()
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
