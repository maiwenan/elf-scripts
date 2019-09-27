const {
  success
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'umd [entry]'
exports.desc = 'Create an empty repo'
exports.builder = {
  entry: {
    default: '.'
  }
}
exports.handler = function (argv) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  // const elf = new ElfScripts(argv.env);
  success('init called for entry', argv)
  success('init called for entry', argv)
}
