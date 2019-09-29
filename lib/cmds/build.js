const {
  success,
  handleError
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'build'
exports.desc = 'build with es mode'
exports.builder = {}
exports.handler = async function (argv) {
  const elf = new ElfScripts('build', argv.env)

  try {
    const result = await elf.runBuild()

    success(result)
  } catch (e) {
    handleError(e)
  }
}
