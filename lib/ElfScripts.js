const fs = require('fs')
const dotenv = require('dotenv')
const rollup = require('rollup')
const _ = require('lodash')

const RollupConfig = require('./config/index')
const parseConfig = require('./config/config.parser')
const utils = require('./utils/utils')
const defaultConfig = require('./config/config.default')

class ElfScripts {
  constructor (mode, envName) {
    this.pkg = this.loadPkg()
    this.elfConfig = this.loadElfConfig(defaultConfig)
    this.elfConfig.name = this.elfConfig.name || utils.parseName(this.pkg.name)

    const variables = this.loadEnv(envName)
    const isProdction = variables.NODE_ENV === 'production'

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
    const userConfig = utils.importCjsModule('elf.config.js')
    const elfConfig = _.merge(defaultConfig, userConfig)

    return elfConfig
  }

  loadEnv (envName) {
    const path = utils.resolvePath(`.env.${envName}`)
    const variables = dotenv.parse(fs.readFileSync(path))

    for (const name in variables) {
      process.env[name] = variables[name]
    }
    variables.NODE_ENV = process.env.NODE_ENV = variables.NODE_ENV || process.env.NODE_ENV
    return variables
  }

  loadPkg () {
    return utils.importCjsModule('package.json')
  }

  async build () {

  }

  async runBuild () {
    const rollupConfig = await this.rollupCfg.get()
    console.log(rollupConfig)
    const { input, output } = parseConfig(rollupConfig)
    const bundle = await rollup.rollup(input)

    await bundle.write(output)
  }

  runServe () {

  }
}

module.exports = ElfScripts
