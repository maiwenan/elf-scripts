const {
  handleError
} = require('../utils/logger')
const ElfScripts = require('../ElfScripts')

exports.command = 'iife'
exports.desc = 'build with iife mode'
exports.builder = {}
exports.handler = async function (argv) {
  const elf = new ElfScripts('iife', argv.env)

  try {
    await elf.runBuild()
  } catch (e) {
    handleError(e)
  }
}
