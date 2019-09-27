const path = require('path')
const utils = require('./lib/utils/utils')

async function run () {
  const result = await utils.readEntryModule(path.resolve(__dirname, './lib'))

  console.log(result)
}

run()
