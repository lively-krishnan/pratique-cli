
/**
 * cli 工具提示交互
 */
const fs = require('fs')
const { isEmpty }  = require('./utils')
const { FRAMEWORKS,MoreTemplates } = require('./template-config')

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
    initial: defaultProjectName,
    onState: (state) => {
      (dir = state.value.trim() || defaultProjectName)
    }
  }
}

/**
 * 是否覆盖
 * @returns 
 */
function overwrite () {
  return {
    type: () => !fs.existsSync(dir) || isEmpty(dir) ? null : 'confirm',
    name: 'overwrite',
    message: () => 
    (dir === '.'
      ? 'Current directory'
      : `Target directory "${dir}"`) +
    ` is not empty. Remove existing files and continue?`
  }
}

/**
 * 
 * @returns 
 */
function packageName() {
    return {
      type: 'text',
      name: 'packageName',
      message: 'What is your package name?',
      validate: (val) => {
        if(val) return true
        return 'please package name'
      }
    }
}


function framework(template) {
  return {
      type: !MoreTemplates || template && FRAMEWORKS.includes(template) ? null : 'select',
      name: 'framework',
      message:
          typeof template === 'string' && !FRAMEWORKS.includes(template)
            ? `"${template}" isn't a valid template. Please choose from below: `
            : 'Select a framework:',
      initial: 0,
      choices: FRAMEWORKS.map((framework) => {
          return {
            title: framework,
            value: framework
          }
      })
    }
}

/**
 * Ul 组件库
 * @returns 
 */
function componentLibrary() {
  return {
    type: 'select',
    name: 'componentLibrary',
    message: 'Which component library you want to use?',
    choices: [
        { title: 'Element Plus Ui', value: 'element-plus' },
        { title: 'Ant Design Vue Ui', value: 'ant-design-vue@next' },
        { title: 'Naive Ui', value: 'naive-ui' }
    ],
  }
}


function selectYourCss() {
  return {
    type: 'select',
    name: 'selectYourCss',
    message: 'Select your CSS',
    choices: [
        { title: 'Sass', value: 'sass node-sass sass-loader' },
        { title: 'Less', value: 'less less-loader' },
        { title: 'Styles', value: 'stylus stylus-loader' }
    ],
  }
}



module.exports = {
  projectName,
  overwrite,
  packageName,
  framework,
  componentLibrary,
  selectYourCss
}