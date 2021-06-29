
/**
 * cli 工具提示交互
 */
const fs = require('fs')
const { isEmpty }  = require('./file-method')
const { FRAMEWORKS,MoreTemplates } = require('./config')

let dir = ''
/**
 * 创建项目名
 * @param {string} targetDir 目标路径
 * @param {string} defaultProjectName  默认项目名
 * @returns 
 */
function projectName (targetDir,defaultProjectName) {
  return {
    type: targetDir ? null : 'text',
    name: 'projectName',
    message: 'project name',
    default: defaultProjectName,
    filter: (val) => {
      dir = val.trim() || defaultProjectName
      return dir
    }
  }
}

/**
 * 是否覆盖
 * @returns 
 */
function overwrite () {
  return {
    type: 'confirm',
    name: 'overwrite',
    message: () => 
    (dir === '.'
      ? 'Current directory'
      : `Target directory "${dir}"`) +
    ` is not empty. Remove existing files and continue?`,
    when: (answers) => {
      return !fs.existsSync(answers.projectName) || isEmpty(answers.projectName) ? false : true
    }
  }
}

/**
 * 设置 package name 
 * @returns 
 */
function packageName() {
    return {
      type: 'input',
      name: 'packageName',
      message: 'What is your package name?',
      validate: (val) => {
        if(val) return true
        return 'please package name'
      }
    }
}

/**
 * 设置框架
 * TODO: FRAMEWORKS 需要改
 * 
 */
function framework(template) {
  return {
      type: 'list',
      name: 'framework',
      message:
          typeof template === 'string' && !FRAMEWORKS.includes(template)
            ? `"${template}" isn't a valid template. Please choose from below: `
            : 'Select a framework:',
      default: 0,
      choices: FRAMEWORKS.map((framework) => {
          return {
            title: framework,
            value: framework
          }
      }),
      when: (answers) => {
        return !MoreTemplates || template && FRAMEWORKS.includes(template) ? false : true
      }
    }
}

/**
 * 选择 JS 
 */
function selectVariant () {
  const params = {
    'JavaScript' : 'js',
    'TypeScript': 'ts',
  }
  return {
    type: 'list',
    name: 'selectVariant',
    message: 'Select a variant :',
    choices: ['JavaScript','TypeScript'],
    filter:(val) => {
      return params[val]
    }
  }
}


/**
 * Ul 组件库
 * @returns 
 */
function componentLibrary() {
  const params = {
    'Element Plus Ui': 'element-plus',
    'Ant Design Vue Ui': 'ant-design-vue@next',
    'Naive Ui': 'naive-ui'
  }
  return {
    type: 'list',
    name: 'componentLibrary',
    message: 'Which component library you want to use?',
    choices: ['Element Plus Ui',  'Ant Design Vue Ui', 'Naive Ui'],
    filter:(val) => {
      return params[val]
    }
  }
}

/**
 * 是否安装依赖 默认自动安装
 * @returns 
 */
function manuallyInstallDep() {
  return {
    type: 'list',
    name: 'manuallyInstallDep',
    message: 'Select how to install dependencies :',
    default: 0,
    choices: ['Custom','Manual','Automatic'],
    filter:(val) => {
      return val.toLowerCase()
    }
  }
}


function selectYourCss() {
  const params = {
    Sass: 'sass node-sass sass-loader',
    Less: 'less less-loader',
    Stylus: 'stylus stylus-loader'
  }
  return {
    type: 'list',
    name: 'selectYourCss',
    message: 'Select your CSS',
    choices: ['Sass','Less','Styles'],
    filter:(val) => {
      return params[val]
    },
    when: (answers) => {
      return answers.manuallyInstallDep === 'automatic'
    }
  }
}

function customDependency() {
  return {
    type: 'input',
    name: 'customDependency',
    message: 'Customize your dependencies',
    filter:(val) =>{
      return val.split(/[\n\s+,，|]/g).filter((val) => val !== '')
    },
    when: (answers) => {
      return answers.manuallyInstallDep === 'custom'
    }
  }
}


module.exports = {
  projectName,
  overwrite,
  packageName,
  framework,
  componentLibrary,
  selectVariant,
  manuallyInstallDep,
  customDependency,
  selectYourCss,
}