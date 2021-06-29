// 封装
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora();

const start = msg => {
  spinner.text = chalk.blue(msg)
  spinner.start();
}

const success = msg => {
  spinner.stopAndPersist({
    symbol: chalk.green('✔'),
    text: chalk.green(msg),
  })
}

const stop = () => {
  spinner.stop();
};

const error = msg => {
  spinner.fail(chalk.red(msg));
};

module.exports = {
  start,
  stop,
  success,
  error,
}