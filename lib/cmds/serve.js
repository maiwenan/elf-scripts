const {
  handleError
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'serve'
exports.desc = 'serve library'
exports.builder = {}
exports.handler = async function (argv) {
  process.env.NODE_ENV = 'develoment'

  const elf = new ElfScripts('serve', argv.env)

  try {
    await elf.runServe()
  } catch (e) {
    handleError(e)
  }
}
