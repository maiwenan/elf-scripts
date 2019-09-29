const {
  handleError
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'umd'
exports.desc = 'build with umd mode'
exports.builder = {}
exports.handler = async function (argv) {
  const elf = new ElfScripts('umd', argv.env)

  try {
    await elf.runBuild()
  } catch (e) {
    handleError(e)
  }
}
