const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk');
const { copy } = require('./util/file-method')
const spinner = require('./util/ora')
const cwd = process.cwd()
const log = console.log

async function init() {
  let result = {}
  try {
    const q = require('./util/questions')
    result = await inquirer.prompt([
      q.projectName(),
      q.packageName()
    ])
  }catch(cancelled) {
    log(chalk.red(cancelled.message))
    return
  }

  const {projectName,packageName} = result
  
  const root = path.join(cwd, projectName)

  fs.mkdirSync(root);
  // 脚手架 项目路径
  log(chalk.blue(`\nScaffolding project in ${root}...`))

  // 拼接创建模板路径
  const templateDir = path.join(__dirname.replace('/lib','/bin'), `create-app/template-admin`)
  
  // 返回一个包含 指定目录下所有文件名称 的数组对象
  let files = fs.readdirSync(templateDir)
  
  // 循环写入
  for (const file of files.filter((f) => f !== 'package.json')){ write(file) }
  
  // 获取模板下的 package.json 内容 变为对象
  const pkg = require(path.join(templateDir, `package.json`))

  // 修改 package name
  pkg.name = packageName

  // 同步写入文件
  write('package.json', JSON.stringify(pkg, null, 2))


  spinner.success('Done. Now run: \n')
  log(chalk.green(`  cd ${path.relative(cwd, root)}`))
  log(chalk.green('  npm run dev\n'))

  /**
   * 写入文件
   * @param { string } file 文件名
   * @param { string } content 内容
   */
  function write(file, content) {
    const renameFiles = {
      _gitignore: '.gitignore'
    }
    
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)

    if(content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }
}

module.exports = () => {
  return init().catch(err => {
    log(chalk.red(err))
  })
}