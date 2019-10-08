#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

yargs
  .usage('Usage: elf-scripts <command> [options]')
  .option('env', {
    alias: 'e',
    describe: 'load your env variables'
  })
  .option('modern', {
    alias: 'm',
    describe: 'bundle your library with modern style'
  })
  .commandDir(path.resolve(__dirname, '../lib/cmds'))
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2019')
  .parse()
