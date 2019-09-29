const chalk = require('chalk')
const log = console.log

exports.info = msg => {
  log(msg)
}

exports.success = msg => {
  log(chalk.green(msg))
}

exports.warnning = msg => {
  log(chalk.yellow(msg))
}

exports.error = msg => {
  log(chalk.red(msg))
}

exports.handleError = e => {
  exports.error(e.message)
  exports.error(e.stack)
}
