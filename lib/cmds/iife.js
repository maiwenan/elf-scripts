exports.command = 'iife <name> [names..]'
exports.desc = 'Delete tracked branches gone stale for remotes'
exports.builder = {}
exports.handler = function (argv) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  console.log('pruning remotes %s', [].concat(argv.name).concat(argv.names).join(', '))
}
