#!/usr/bin/env node

const semver = require('semver')
const program = require('commander');
const chalk = require('chalk');
const package = require('../package.json')
const log = console.log

function checkNodeVersion(wanted, packageName) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + packageName +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

// 检查node 版本
checkNodeVersion(package.engines.node,package.name)


program.version(`${package.name} ${package.version}`).usage('<command> [options]')

program
.command('create <app-name>')
.description('create a new project demo')
.option('-d, --dir <dirName>','Project Installation Path')
.option('-t, --template <templateFramework>','Use that template framework')
.action((name, options) => {
  if(require('minimist')(process.argv.slice(3))._.length > 1) {
    log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    log(chalk.yellow(' 您提供了多个参数。第一个将被用作应用程序的名称，其余的将被忽略。'))
  }

  require('../lib/create')(name, options)
})

program.on('command:*', function () {
  log('\nInvalid command: %s \nSee --help for a list of available commands. \n', chalk.red(`${program.args.join(' ')}`));
  process.exit(1);
})


program.parse(process.argv);
