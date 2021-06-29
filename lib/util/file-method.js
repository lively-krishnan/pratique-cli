const fs = require('fs')
const path = require('path')

function isEmpty(pathStr) {
  return fs.readdirSync(pathStr).length === 0
}

function emptyDir(dir){
  // 如果路径存在则返回 true，否则返回 false。
  if(!fs.existsSync(dir)) return

  // 读取目录的内容。
  for(const file of fs.readdirSync(dir)) {
    // 方法将路径或路径片段的序列解析为绝对路径。
    const abs = path.resolve(dir, file)
    console.log(abs);
    // 检索 path 引用的符号链接的
    // 如果 <fs.Dirent> 对象描述文件系统目录，则返回 true。
    if(fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      // 以同步的方法删除文件目录
      fs.rmdirSync(abs)
    }else {
      // 同步版的 unlink() ，删除文件操作。
      fs.unlinkSync(abs)
    }
  }
}

  function copyDir(srcDir, destDir) {
    // 同步创建目录。
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file)
      const destFile = path.resolve(destDir, file)
      copy(srcFile, destFile)
    }
  }

  /**
   * copy 目录 文件
   * @param {*} src  路径
   * @param {*} dest 目的地
   */
  function copy(src, dest) {
    // 检索传入的路径
    const stat = fs.statSync(src) 
    // 如果表示的是一个目录则返回true
    if(stat.isDirectory()){
      // 按层级递归复制目录内容
      copyDir(src, dest)
    }else {
      // 创建文件
      fs.copyFileSync(src, dest)
    }
  }

//   function copyDir(srcDir, destDir) {
//     fs.mkdirSync(destDir, { recursive: true })
//     for (const file of fs.readdirSync(srcDir)) {
//       const srcFile = path.resolve(srcDir, file)
//       const destFile = path.resolve(destDir, file)
//       const stat = fs.statSync(srcFile)
//       if (stat.isDirectory()) {
//         copyDir(srcFile, destFile)
//       } else {
//         fs.copyFileSync(srcFile, destFile)
//       }
//     }
// }

/**
 * 递归创建层级目录
 * @param {*} dirname 
 * @returns 
 */
  function mkdirSyncs(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirSyncs(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  module.exports = {
    isEmpty,
    emptyDir,
    copyDir,
    copy,
    mkdirSyncs
  }