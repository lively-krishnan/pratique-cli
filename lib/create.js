
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk');
const { emptyDir, copy } = require('./util/file-method')
const exec = require("./util/exec")
const spinner = require('./util/ora')
const cwd = process.cwd()
const log = console.log

async function init(projectName,options) {
  //  模板名称  
  let template = options.template
  
  let result = {}

  try {
    const q = require('./util/questions')
    result = await inquirer.prompt([
      q.overwrite(),
      q.packageName(),
      q.framework(template),
      q.selectVariant(),
      q.componentLibrary()
    ])
  }catch(cancelled) {
    log(chalk.red(cancelled.message))
    return
  }

  const { 
    packageName,
    overwrite, 
    framework,
    selectVariant,
    componentLibrary,
  } = result
  

  const root = path.join(cwd, projectName)

  // 判断是否覆盖 
  if(overwrite) {
    emptyDir(root)
    // 如果路径不存在 则同步新创建一个目录
  }else if(!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  
  // 依赖包集合
  const relyOn = [
    componentLibrary
  ].filter((val) => val !== '')
  // 框架模板名称
  template = framework || template || 'vue'

  // 脚手架 项目路径
  log(chalk.blue(`\nScaffolding project in ${root}...`))

  // 拼接创建模板路径
  const templateDir = path.join(__dirname.replace('/lib','/bin'), `create-app/template-${template}-${selectVariant}`)

  // 返回一个包含 指定目录下所有文件名称 的数组对象
  let files = fs.readdirSync(templateDir)

  // 循环写入
  for (const file of files.filter((f) => f !== 'package.json')){ write(file) }

  // 获取模板下的 package.json 内容 变为对象
  console.log(templateDir,'=====2=2==2=2=2=2=2');
  const pkg = require(path.join(templateDir, `package.json`))

  // 修改 package name
  pkg.name = packageName

  // 同步写入文件
  write('package.json', JSON.stringify(pkg, null, 2))
    // 判断是否为 yarn 或者 npm 
  const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm'

  // 操作命令
  const operationCommand = pkgManager === 'yarn' ? 'yarn add' : 'npm i'

  // 执行命令
  const command = `cd ${path.relative(cwd, root)} && ${operationCommand} -D ${relyOn.join(' ')}`

  // 请等待正在安装依赖包
  log(chalk.green(`\n\n Please wait for a dependency package to be installed \n`))

  spinner.start('Loading...\n')

  // 执行依赖包安装命令
  await exec(command)
  .then(
    res => {
      log(`${res.stdout}`)
      spinner.success('Done. Now run: \n')
      if (root !== cwd) log(chalk.green(`  cd ${path.relative(cwd, root)}`))
      log(chalk.green(`  ${pkgManager === 'yarn' ? `yarn dev` : `npm run dev`}\n`))
    }
  )
  .catch(
    err => {
      spinner.error('Load error \n')
    }
  )

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


module.exports = (...args) => {
  return init(...args).catch(err => {
    log(chalk.red(err))
  })
}