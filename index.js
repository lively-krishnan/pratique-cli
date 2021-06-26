#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts')
const chalk = require('chalk');
const { emptyDir, copy }  = require('./bin/utils')
const exec = require("./utils/exec")
const spinner = require('./utils/ora')
const cwd = process.cwd()
const log = console.log

async function init() {
  // 目标目录
  let targetDir = argv._[0]
  //  模板
  let template = argv.template || argv.t
  // 默认目录名称
  const defaultProjectName = !targetDir ? 'project-demo' : targetDir

  let result = {}

  try {
    const q = require('./bin/questions')
    result = await prompts([
      q.projectName(targetDir,defaultProjectName),
      q.overwrite(),
      q.packageName(),
      q.framework(template),
      q.componentLibrary(),
      q.selectYourCss()
    ])
  }catch(cancelled) {
    log(chalk.red(cancelled.message))
    return
  }


  const { 
    projectName, 
    packageName,
    overwrite, 
    framework,
    componentLibrary,
    selectYourCss 
  } = result

  const root = path.join(cwd, projectName)

  // 判断是否覆盖 
  if(overwrite) {
    emptyDir(root)
    // 如果路径不存在 则同步新创建一个目录
  }else if(!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  
  // 框架模板名称
  template = framework || template || 'vue'

  // 脚手架 项目路径
  log(chalk.blue(`\nScaffolding project in ${root}...`))
  
  // 模板路径
  const templateDir = path.join(__dirname, `template-${template}`)

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

  // 判断是否为 yarn 或者 npm 
  const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm'

  // 操作命令
  const operationCommand = pkgManager === 'yarn' ? 'yarn add' : 'npm i'

  // 依赖包集合
  const relyOn = [
    componentLibrary,
    selectYourCss
  ]

  // 执行命令
  const command = `cd ${path.relative(cwd, root)} && ${operationCommand} -D ${relyOn.join(' ')}`

  // 请等待开始安装依赖包
  log(chalk.green(`\n\n Please wait to start installing [ ${relyOn.join(' ')} ] dependency packages \n`))

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

  init()
  .catch(
    err => {
      log(chalk.red(err))
    }
  )



