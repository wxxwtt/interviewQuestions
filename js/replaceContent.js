/**
 *  修改文件模块
 *  批量修改文件内容模块 深层遍历
 *
 */
const fs = require('fs');

const tokenMap = {
  'wx.': 'tt.',
  'wx:': 'tt:',
  '.wxss': '.ttss',
  '.wxml': '.ttml',
};

const matchStr = Object.keys(tokenMap).join('|');

/**
 * 替换文件内容
 */

function replaceFile(filePath) {
  fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      throw err;
    }

    const reg = new RegExp(matchStr, 'g');
    const result = data.replace(reg, (match) => {
      if (tokenMap[match]) {
        return tokenMap[match];
      }
      return match;
    });
    if (result) {
      fs.writeFile(filePath, result, (err) => {
        if (err) {
          console.error('error 修改失败 ==> ', err);
        } else {
          console.log('success 修改成功 ==>  ' + filePath);
        }
      });
    }
  });
}

function findFiles(filePath) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((item) => {
      const path = filePath + '/' + item;
      // 判断文件的状态
      fs.stat(path, (err, status) => {
        if (err) {
          return err;
        }
        const isFile = status.isFile(); // 是文件
        const isDir = status.isDirectory(); // 是文件夹
        if (isFile) {
          replaceFile(path);
        }
        if (isDir) {
          findFiles(filePath + '/' + item);
        }
      });
    });
  });
}

findFiles('dist');
