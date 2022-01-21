/**
 *  批量修改文件名称模块
 *  批量修改文件名称 深层遍历 文件夹内的文件名称也会被修改
 */

const fs = require('fs');
const path = require('path');

const nameMap = {
  '.wxml': '.ttml',
  '.wxss': '.ttss',
};
const matchName = Object.keys(nameMap).join('|');
function rename(filePath) {
  const reg = new RegExp(matchName, 'g');
  const newFileName = filePath.replace(reg, (match) => nameMap[match]);
  fs.rename(filePath, newFileName, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }

    if (filePath !== newFileName) {
      console.log('修改文件名称', filePath + '  ==>  ' + newFileName);
    }
  });
}
/**
  遍历文件下所有文件
*/
function findFiles(filePath) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      return err;
    }
    files.forEach((item) => {
      const oldPath =
        path.resolve(__dirname, '..') + '/' + filePath + '/' + item;

      // 判断文件的状态
      fs.stat(oldPath, (err, status) => {
        if (err) {
          console.log(err);
          return err;
        }

        const isFile = status.isFile(); // 是文件
        const isDir = status.isDirectory(); // 是文件夹
        if (isFile) {
          rename(oldPath);
        }

        if (isDir) {
          findFiles(filePath + '/' + item);
        }
      });
    });
  });
}

findFiles('dist');
