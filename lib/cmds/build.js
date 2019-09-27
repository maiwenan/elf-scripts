const {
  success,
  error
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'build [entry]'
exports.desc = 'Create an empty repo'
exports.builder = {
  entry: {
    default: '.'
  }
}
exports.handler = function (argv) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  success('init called for entry', argv)

  const elf = new ElfScripts('build', argv.env)

  try {
    elf.runBuild()
  } catch (e) {
    error(e)
  }
}
